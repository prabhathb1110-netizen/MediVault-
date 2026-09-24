import { useEffect, useMemo, useState } from 'react';
import { api } from '../api.js';
import { useAuth } from '../auth.jsx';
import ItemForm from '../components/ItemForm.jsx';
import StatusBadge from '../components/StatusBadge.jsx';
import { daysUntil, money } from '../utils.js';

export default function Dashboard() {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filter, setFilter] = useState('');
  const [editing, setEditing] = useState(null); // null | 'new' | an inventory item
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  async function load() {
    try {
      const [inv, cats] = await Promise.all([api.getInventory(), api.getCategories()]);
      setItems(inv);
      setCategories(cats);
      setError('');
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => { load(); }, []);

  const stats = useMemo(() => ({
    total: items.length,
    low: items.filter((i) => i.status === 'low').length,
    out: items.filter((i) => i.status === 'out_of_stock').length,
    expiring: items.filter((i) => { const d = daysUntil(i.expiry_date); return d !== null && d <= 30; }).length,
  }), [items]);

  const shown = items.filter((i) => i.name.toLowerCase().includes(filter.toLowerCase()));

  async function save(values) {
    if (editing === 'new') await api.addItem(values);
    else await api.updateItem(editing.id, values);
    setEditing(null);
    await load();
  }

  async function remove(item) {
    if (!window.confirm(`Remove ${item.name} from your stock list?`)) return;
    try {
      await api.deleteItem(item.id);
      await load();
    } catch (e) {
      setError(e.message);
    }
  }

  return (
    <section>
      <h1>Stock dashboard</h1>
      <p className="muted">Signed in as {user.name}</p>

      <div className="stats">
        <div className="stat"><b>{stats.total}</b>Medicines listed</div>
        <div className="stat"><b>{stats.low}</b>Low stock</div>
        <div className="stat"><b>{stats.out}</b>Out of stock</div>
        <div className="stat"><b>{stats.expiring}</b>Expiring in 30 days</div>
      </div>

      <div className="toolbar">
        <input placeholder="Filter your medicines" value={filter} onChange={(e) => setFilter(e.target.value)} aria-label="Filter medicines" />
        <button className="btn" onClick={() => setEditing('new')}>Add medicine</button>
      </div>

      {error && <div className="notice notice-error" role="alert">{error}</div>}
      {loading && <p className="empty">Loading your stock...</p>}
      {!loading && !shown.length && (
        <p className="empty">{items.length ? 'No medicines match your filter.' : 'No medicines yet. Add your first one.'}</p>
      )}

      {shown.length > 0 && (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Medicine</th><th>Category</th><th>Qty</th><th>Price</th><th>Status</th><th>Expiry</th><th></th>
              </tr>
            </thead>
            <tbody>
              {shown.map((i) => {
                const d = daysUntil(i.expiry_date);
                return (
                  <tr key={i.id}>
                    <td>{i.name}<div className="muted small">{i.generic_name}</div></td>
                    <td>{i.category_name}</td>
                    <td>{i.quantity}</td>
                    <td>{money(i.price)}</td>
                    <td><StatusBadge status={i.status} /></td>
                    <td>
                      {i.expiry_date || '-'}
                      {d !== null && d <= 30 && <span className="flag">{d < 0 ? 'Expired' : `Expires in ${d} days`}</span>}
                    </td>
                    <td>
                      <div className="actions">
                        <button className="btn btn-ghost btn-sm" onClick={() => setEditing(i)}>Edit</button>
                        <button className="btn btn-danger btn-sm" onClick={() => remove(i)}>Delete</button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {editing && (
        <ItemForm
          initial={editing === 'new' ? null : editing}
          categories={categories}
          onSave={save}
          onCancel={() => setEditing(null)}
        />
      )}
    </section>
  );
}
