This folder is a subset of OpenERP 7.0 (the 2013 release of Odoo), unmodified, AGPL-3:
- `addons/account/` — the accounting module: taxes (`account.py`, class `account_tax`, `compute_all`), invoices (`account_invoice.py`), journals, chart of accounts, reports, XML views, demo data.
- `openerp/osv/` — the in-house ORM the module is written against (`osv.osv`, `fields`), so the model definitions can be read.
- `openerp/release.py` — version 7.0, Python 2.7.
The rest of the server (web client, other addons, translations) was left out to keep the analysis focused; the full tree is at https://github.com/odoo/odoo/tree/7.0.
