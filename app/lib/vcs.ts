/** Git's object model over the tax configuration: commits, refs, a permanent ref log, and change requests. */
import { prisma } from "./db";
import { canonicalJson, hashObject } from "./canonical";
import type { ConfigTree } from "./config";
import { audit } from "./audit";
import type { Principal } from "./sod";

export const MAIN = "main";

export function treeHash(tree: ConfigTree): string {
  return hashObject("tree", canonicalJson(tree));
}

export function commitHash(tree: ConfigTree, parents: string[], authorId: string, message: string): string {
  return hashObject("commit", canonicalJson({ tree: treeHash(tree), parents, author: authorId, message }));
}

export async function putCommit(tree: ConfigTree, parents: string[], author: Principal, message: string) {
  const hash = commitHash(tree, parents, author.id, message);
  const existing = await prisma.configCommit.findUnique({ where: { hash } });
  if (existing) return existing;
  return prisma.configCommit.create({ data: { hash, parents, tree: tree as object, authorId: author.id, message } });
}

export async function treeAt(hash: string): Promise<ConfigTree> {
  const c = await prisma.configCommit.findUniqueOrThrow({ where: { hash } });
  return c.tree as unknown as ConfigTree;
}

export async function head(refName: string): Promise<string> {
  const r = await prisma.ref.findUniqueOrThrow({ where: { name: refName } });
  return r.commitHash;
}

export async function moveRef(refName: string, toHash: string, actor: Principal, reason: string) {
  const ref = await prisma.ref.findUniqueOrThrow({ where: { name: refName } });
  if (ref.kind === "tag") throw new Error(`'${refName}' is a tag and never moves`);
  await prisma.$transaction([
    prisma.ref.update({ where: { name: refName }, data: { commitHash: toHash } }),
    prisma.refLog.create({ data: { refName, fromHash: ref.commitHash, toHash, actorId: actor.id, reason } }),
  ]);
}

export async function createBranch(name: string, fromRef: string, actor: Principal) {
  const at = await head(fromRef);
  if (await prisma.ref.findUnique({ where: { name } })) throw new Error(`'${name}' already exists`);
  await prisma.$transaction([
    prisma.ref.create({ data: { name, kind: "branch", commitHash: at, createdBy: actor.id } }),
    prisma.refLog.create({ data: { refName: name, fromHash: null, toHash: at, actorId: actor.id, reason: `branch from ${fromRef}` } }),
  ]);
  await audit(actor, "config.branch_created", "ref", name, `${actor.displayName} created branch '${name}' from ${fromRef}`, { from: fromRef, at });
  return at;
}

export async function createTag(name: string, atRef: string, actor: Principal) {
  const at = await head(atRef);
  await prisma.$transaction([
    prisma.ref.create({ data: { name, kind: "tag", commitHash: at, createdBy: actor.id, protected: true } }),
    prisma.refLog.create({ data: { refName: name, fromHash: null, toHash: at, actorId: actor.id, reason: `tag ${atRef}` } }),
  ]);
  await audit(actor, "config.tag_created", "ref", name, `${actor.displayName} tagged ${at.slice(0, 12)} as '${name}'`, { at });
}

/** Commit a new tree on a branch. `main` is protected: changes arrive only by merge. */
export async function commitOnBranch(branch: string, tree: ConfigTree, actor: Principal, message: string) {
  const ref = await prisma.ref.findUniqueOrThrow({ where: { name: branch } });
  if (ref.protected) throw new Error(`'${branch}' is protected: open a change request instead of committing to it directly`);
  const parent = ref.commitHash;
  const parentTree = await treeAt(parent);
  if (treeHash(parentTree) === treeHash(tree)) throw new Error("That change leaves the configuration exactly as it was");
  const c = await putCommit(tree, [parent], actor, message);
  await moveRef(branch, c.hash, actor, `commit: ${message.slice(0, 80)}`);
  await audit(actor, "config.committed", "commit", c.hash, `${actor.displayName} committed on '${branch}': ${message}`, { branch, parent });
  return c;
}

/** Nearest common ancestor (histories here are shallow). */
export async function mergeBase(a: string, b: string): Promise<string> {
  const ancestorsA = new Set<string>();
  const queue = [a];
  while (queue.length) {
    const h = queue.shift()!;
    if (ancestorsA.has(h)) continue;
    ancestorsA.add(h);
    const c = await prisma.configCommit.findUnique({ where: { hash: h } });
    if (c) queue.push(...c.parents);
  }
  const q2 = [b];
  const seen = new Set<string>();
  while (q2.length) {
    const h = q2.shift()!;
    if (seen.has(h)) continue;
    seen.add(h);
    if (ancestorsA.has(h)) return h;
    const c = await prisma.configCommit.findUnique({ where: { hash: h } });
    if (c) q2.push(...c.parents);
  }
  throw new Error("No common ancestor");
}

export async function nextRequestNumber(): Promise<string> {
  const n = await prisma.changeRequest.count();
  return `CR-${String(n + 1).padStart(4, "0")}`;
}
