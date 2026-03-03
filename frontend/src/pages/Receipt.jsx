import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../services/api';

export default function Receipt() {
  const { id } = useParams();
  const [payment, setPayment] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.payments.getReceipt(id).then((res) => setPayment(res.data)).catch(() => setPayment(null)).finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="bg-page min-h-[60vh] flex items-center justify-center"><span className="text-dusk-blue">Loading...</span></div>;
  if (!payment) return <div className="bg-page min-h-[60vh] flex items-center justify-center"><p className="text-slate-600">Receipt not found.</p></div>;

  const r = payment.ride;

  return (
    <div className="bg-page min-h-[60vh] py-8 px-4">
      <div className="max-w-lg mx-auto">
        <div className="bg-white rounded-xl shadow-card border border-slate-200/80 p-6 md:p-8">
          <h1 className="text-xl font-semibold text-jet-black mb-6">Payment receipt</h1>
          <div className="space-y-2 text-sm">
            <p><span className="text-slate-500">Amount:</span> ₹{payment.amount}</p>
            <p><span className="text-slate-500">Method:</span> {payment.method}</p>
            <p><span className="text-slate-500">Status:</span> {payment.status}</p>
            {payment.transactionId && <p><span className="text-slate-500">Transaction ID:</span> {payment.transactionId}</p>}
            <p><span className="text-slate-500">Date:</span> {new Date(payment.createdAt).toLocaleString()}</p>
          </div>
          <hr className="my-6 border-slate-200" />
          <p className="text-slate-500 text-sm font-medium mb-1">Ride details</p>
          <p>Pickup: {r.pickupLocation}</p>
          <p>Drop: {r.dropLocation}</p>
          <p>Fare: ₹{r.fare}</p>
          <Link to="/rides" className="inline-block mt-6 text-dusk-blue font-medium hover:underline">← My rides</Link>
        </div>
      </div>
    </div>
  );
}
