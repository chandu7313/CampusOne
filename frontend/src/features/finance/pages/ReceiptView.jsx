import { X, Printer } from 'lucide-react';

export default function ReceiptView({ payment, onClose }) {
  const handlePrint = () => window.print();
  const fmt = (n) => `₹${Number(n || 0).toLocaleString('en-IN')}`;
  const student = payment?.student?.user || payment?.studentFee?.student?.user;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="glass rounded-2xl border border-border-custom w-full max-w-lg shadow-2xl">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border-custom">
          <h2 className="font-bold text-lg">Payment Receipt</h2>
          <div className="flex items-center gap-2">
            <button onClick={handlePrint} className="p-1.5 rounded-lg hover:bg-primary/10 transition-all" title="Print">
              <Printer size={16} className="text-text-muted" />
            </button>
            <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-primary/10 transition-all"><X size={18} /></button>
          </div>
        </div>

        <div className="p-6 space-y-5 print:p-4" id="receipt-content">
          {/* Header */}
          <div className="text-center border-b border-border-custom pb-4">
            <h3 className="text-xl font-bold">CampusOne University</h3>
            <p className="text-text-muted text-sm">Fee Payment Receipt</p>
          </div>

          {/* Receipt Meta */}
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="bg-bg-main/50 rounded-xl p-3">
              <p className="text-text-muted text-xs mb-1">Receipt No.</p>
              <p className="font-mono font-semibold">{payment.receiptNumber}</p>
            </div>
            <div className="bg-bg-main/50 rounded-xl p-3">
              <p className="text-text-muted text-xs mb-1">Transaction ID</p>
              <p className="font-mono font-semibold text-xs break-all">{payment.transactionId}</p>
            </div>
            <div className="bg-bg-main/50 rounded-xl p-3">
              <p className="text-text-muted text-xs mb-1">Payment Date</p>
              <p className="font-semibold">{new Date(payment.paymentDate).toLocaleDateString('en-IN', { dateStyle: 'long' })}</p>
            </div>
            <div className="bg-bg-main/50 rounded-xl p-3">
              <p className="text-text-muted text-xs mb-1">Payment Method</p>
              <p className="font-semibold">{payment.paymentMethod}</p>
            </div>
          </div>

          {/* Student Info */}
          {student && (
            <div className="border border-border-custom rounded-xl p-4 space-y-1 text-sm">
              <p className="font-semibold text-xs text-text-muted uppercase tracking-wide mb-2">Student Details</p>
              <p><span className="text-text-muted">Name:</span> <span className="font-semibold ml-1">{student.name}</span></p>
              <p><span className="text-text-muted">Email:</span> <span className="ml-1">{student.email}</span></p>
            </div>
          )}

          {/* Fee Breakdown */}
          {payment.studentFee?.feeStructure && (
            <div className="border border-border-custom rounded-xl p-4 space-y-1 text-sm">
              <p className="font-semibold text-xs text-text-muted uppercase tracking-wide mb-2">Fee Details</p>
              <p><span className="text-text-muted">Academic Year:</span> <span className="ml-1">{payment.studentFee.feeStructure.academicYear}</span></p>
              <p><span className="text-text-muted">Semester:</span> <span className="ml-1">{payment.studentFee.feeStructure.semester}</span></p>
            </div>
          )}

          {/* Amount */}
          <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-5 text-center">
            <p className="text-text-muted text-sm mb-1">Amount Paid</p>
            <p className="text-3xl font-bold text-emerald-400">{fmt(payment.amountPaid)}</p>
          </div>

          <p className="text-center text-text-muted text-xs">This is a computer-generated receipt. No signature required.</p>
        </div>
      </div>
    </div>
  );
}
