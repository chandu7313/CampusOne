import { useState, useEffect, useCallback } from 'react';
import { CreditCard, CheckCircle, AlertCircle, Clock, Download, Plus } from 'lucide-react';
import apiClient from '../../../api/apiClient';
import PaymentModal from '../../finance/pages/PaymentModal';
import ReceiptView from '../../finance/pages/ReceiptView';

export default function StudentFees() {
    const [fees, setFees] = useState([]);
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);
    
    const [selectedFee, setSelectedFee] = useState(null);
    const [selectedInstallment, setSelectedInstallment] = useState(null);
    const [paymentModalOpen, setPaymentModalOpen] = useState(false);
    const [receiptPayment, setReceiptPayment] = useState(null);

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const [feesRes, paymentsRes] = await Promise.all([
                apiClient.get('/finance-admin/fees/me'),
                apiClient.get('/finance-admin/fees/payments/me?limit=50')
            ]);
            setFees(feesRes.data.data || []);
            setPayments(paymentsRes.data.data || []);
        } catch (err) {
            console.error('Failed to fetch fee data', err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(amount || 0);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-[60vh]">
                <div className="relative w-20 h-20">
                    <div className="absolute inset-0 border-4 border-primary/20 rounded-full"></div>
                    <div className="absolute inset-0 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                </div>
            </div>
        );
    }

    // Active fee is the one with the latest due date or the first pending one
    const activeFee = fees.find(f => f.status !== 'Paid') || fees[0];
    const pastFees = fees.filter(f => f.id !== activeFee?.id);

    const handlePayClick = (fee, installment = null) => {
        setSelectedFee(fee);
        setSelectedInstallment(installment);
        setPaymentModalOpen(true);
    };

    return (
        <div className="flex flex-col xl:flex-row gap-8 max-w-[1600px] mx-auto pb-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Left Column - Main Content */}
            <div className="flex-1 flex flex-col gap-8">
                <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-border-custom/50 pb-8 px-2">
                    <div className="space-y-2">
                        <h1 className="text-4xl font-black italic tracking-tighter text-text-main uppercase">
                            Fee <span className="text-primary italic">Management</span>
                        </h1>
                        <p className="text-text-muted font-medium">View your fee structures and make payments.</p>
                    </div>
                </header>

                {activeFee ? (
                    <div className="glass-card overflow-hidden">
                        <div className="p-8 pb-0 flex flex-col md:flex-row justify-between items-start gap-6 border-b border-border-custom/50">
                            <div>
                                <div className="flex items-center gap-3 mb-2">
                                    <h2 className="text-3xl font-black text-text-main">Current Semester Fee</h2>
                                    <span className={`px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full flex items-center gap-1.5 ${
                                        activeFee.status === 'Paid' ? 'bg-green-500/10 text-green-500' :
                                        activeFee.status === 'Partial' ? 'bg-orange-500/10 text-orange-500' :
                                        activeFee.status === 'Overdue' ? 'bg-red-500/10 text-red-500' :
                                        'bg-blue-500/10 text-blue-500'
                                    }`}>
                                        {activeFee.status === 'Paid' ? <CheckCircle size={14} /> : 
                                         activeFee.status === 'Overdue' ? <AlertCircle size={14} /> : <Clock size={14} />}
                                        {activeFee.status}
                                    </span>
                                </div>
                                <p className="text-text-muted font-medium mb-6">
                                    Academic Year {activeFee.feeStructure?.academicYear} • Sem {activeFee.feeStructure?.semester}
                                </p>
                            </div>
                            
                            <div className="flex flex-col items-end bg-black/5 dark:bg-white/5 p-4 rounded-2xl w-full md:w-auto">
                                <span className="text-xs uppercase font-bold tracking-widest text-text-muted mb-1">Total Due</span>
                                <span className="text-4xl font-black text-text-main">
                                    {formatCurrency(Math.max(0, (activeFee.finalAmount || activeFee.totalAmount) - activeFee.paidAmount))}
                                </span>
                                <span className="text-sm font-medium text-text-muted mt-1">Due by: {new Date(activeFee.dueDate).toLocaleDateString()}</span>
                            </div>
                        </div>

                        <div className="p-8 grid grid-cols-1 lg:grid-cols-2 gap-10">
                            {/* Breakdown */}
                            <div>
                                <h3 className="text-lg font-bold text-text-main mb-4 uppercase tracking-wider">Fee Breakdown</h3>
                                <div className="space-y-3 font-medium text-sm">
                                    <div className="flex justify-between items-center p-3 rounded-xl bg-black/5 dark:bg-white/5 border border-border-custom/50">
                                        <span className="text-text-muted">Tuition Fee</span>
                                        <span className="text-text-main font-bold">{formatCurrency(activeFee.feeStructure?.tuitionFee)}</span>
                                    </div>
                                    <div className="grid grid-cols-2 gap-3 mt-2">
                                        <div className="flex justify-between items-center p-3 rounded-xl bg-black/5 dark:bg-white/5 border border-border-custom/50">
                                            <span className="text-text-muted text-xs">Library Fee</span>
                                            <span className="text-text-main font-semibold text-sm">{formatCurrency(activeFee.feeStructure?.libraryFee)}</span>
                                        </div>
                                        <div className="flex justify-between items-center p-3 rounded-xl bg-black/5 dark:bg-white/5 border border-border-custom/50">
                                            <span className="text-text-muted text-xs">Lab Fee</span>
                                            <span className="text-text-main font-semibold text-sm">{formatCurrency(activeFee.feeStructure?.labFee)}</span>
                                        </div>
                                        <div className="flex justify-between items-center p-3 rounded-xl bg-black/5 dark:bg-white/5 border border-border-custom/50">
                                            <span className="text-text-muted text-xs">Exam Fee</span>
                                            <span className="text-text-main font-semibold text-sm">{formatCurrency(activeFee.feeStructure?.examinationFee)}</span>
                                        </div>
                                        <div className="flex justify-between items-center p-3 rounded-xl bg-black/5 dark:bg-white/5 border border-border-custom/50">
                                            <span className="text-text-muted text-xs">Sports Fee</span>
                                            <span className="text-text-main font-semibold text-sm">{formatCurrency(activeFee.feeStructure?.sportsFee)}</span>
                                        </div>
                                        <div className="flex justify-between items-center p-3 rounded-xl bg-black/5 dark:bg-white/5 border border-border-custom/50">
                                            <span className="text-text-muted text-xs">Hostel Fee</span>
                                            <span className="text-text-main font-semibold text-sm">{formatCurrency(activeFee.feeStructure?.hostelFee)}</span>
                                        </div>
                                        <div className="flex justify-between items-center p-3 rounded-xl bg-black/5 dark:bg-white/5 border border-border-custom/50">
                                            <span className="text-text-muted text-xs">Transport Bus</span>
                                            <span className="text-text-main font-semibold text-sm">{formatCurrency(activeFee.feeStructure?.transportFee)}</span>
                                        </div>
                                        <div className="flex justify-between items-center p-3 rounded-xl bg-black/5 dark:bg-white/5 border border-border-custom/50">
                                            <span className="text-text-muted text-xs">Development</span>
                                            <span className="text-text-main font-semibold text-sm">{formatCurrency(activeFee.feeStructure?.developmentFee)}</span>
                                        </div>
                                        <div className="flex justify-between items-center p-3 rounded-xl bg-black/5 dark:bg-white/5 border border-border-custom/50">
                                            <span className="text-text-muted text-xs">Medical Fee</span>
                                            <span className="text-text-main font-semibold text-sm">{formatCurrency(activeFee.feeStructure?.medicalFee)}</span>
                                        </div>
                                        <div className="flex justify-between items-center p-3 rounded-xl bg-black/5 dark:bg-white/5 border border-border-custom/50">
                                            <span className="text-text-muted text-xs">Miscellaneous</span>
                                            <span className="text-text-main font-semibold text-sm">{formatCurrency(activeFee.feeStructure?.miscellaneous)}</span>
                                        </div>
                                        <div className="flex justify-between items-center p-3 rounded-xl bg-black/5 dark:bg-white/5 border border-border-custom/50">
                                            <span className="text-text-muted text-xs">Other Charges</span>
                                            <span className="text-text-main font-semibold text-sm">{formatCurrency(activeFee.feeStructure?.otherFees)}</span>
                                        </div>
                                    </div>
                                    {Number(activeFee.fineAmount) > 0 && (
                                        <div className="flex justify-between items-center p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 mt-2">
                                            <span>Late Fine (Overdue)</span>
                                            <span className="font-bold">+ {formatCurrency(activeFee.fineAmount)}</span>
                                        </div>
                                    )}
                                    {Number(activeFee.scholarshipAmount) > 0 && (
                                        <div className="flex justify-between items-center p-3 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400">
                                            <span>Scholarship Applied</span>
                                            <span className="font-bold">- {formatCurrency(activeFee.scholarshipAmount)}</span>
                                        </div>
                                    )}
                                    {Number(activeFee.discountAmount) > 0 && (
                                        <div className="flex justify-between items-center p-3 rounded-xl bg-green-500/10 border border-green-500/20 text-green-500">
                                            <span>Discount Applied</span>
                                            <span className="font-bold">- {formatCurrency(activeFee.discountAmount)}</span>
                                        </div>
                                    )}
                                </div>
                                
                                <div className="mt-6 pt-4 border-t border-border-custom flex justify-between items-center">
                                    <span className="text-sm font-bold uppercase tracking-wider text-text-muted">Final Amount</span>
                                    <span className="text-xl font-black text-text-main">{formatCurrency(activeFee.finalAmount || activeFee.totalAmount)}</span>
                                </div>
                                <div className="mt-2 flex justify-between items-center text-green-500">
                                    <span className="text-sm font-bold uppercase tracking-wider">Amount Paid</span>
                                    <span className="text-lg font-black">{formatCurrency(activeFee.paidAmount)}</span>
                                </div>
                            </div>

                            {/* Action Area */}
                            <div className="flex flex-col">
                                <h3 className="text-lg font-bold text-text-main mb-4 uppercase tracking-wider">Payment Options</h3>
                                
                                {activeFee.status === 'Paid' ? (
                                    <div className="flex-1 rounded-2xl border-2 border-dashed border-green-500/30 bg-green-500/5 flex flex-col items-center justify-center p-6 text-center text-green-500/80">
                                        <CheckCircle size={48} className="mb-4 opacity-50" />
                                        <h4 className="text-lg font-bold">All Cleared</h4>
                                        <p className="text-sm font-medium mt-1">You have fully paid the fees for this semester.</p>
                                    </div>
                                ) : activeFee.feeInstallments?.length > 0 ? (
                                    <div className="flex-1 flex flex-col gap-3">
                                        {activeFee.feeInstallments.map((inst, idx) => (
                                            <div key={inst.id} className="p-4 rounded-xl border border-border-custom bg-black/5 dark:bg-white/5 flex items-center justify-between">
                                                <div>
                                                    <p className="text-sm font-bold text-text-muted">Installment {idx + 1}</p>
                                                    <p className="text-xs text-text-muted">Due: {new Date(inst.dueDate).toLocaleDateString()}</p>
                                                </div>
                                                <div className="flex items-center gap-4">
                                                    <span className={`text-sm font-black ${inst.status === 'Paid' ? 'text-green-500' : 'text-text-main'}`}>
                                                        {formatCurrency(inst.amount)}
                                                    </span>
                                                    {inst.status !== 'Paid' ? (
                                                        <button 
                                                            onClick={() => handlePayClick(activeFee, inst)}
                                                            className="px-4 py-1.5 rounded-lg bg-primary text-white text-xs font-bold uppercase tracking-wider hover:bg-primary-hover transition-colors"
                                                        >
                                                            Pay
                                                        </button>
                                                    ) : (
                                                        <span className="px-4 py-1.5 rounded-lg bg-green-500/10 text-green-500 text-xs font-bold uppercase tracking-wider">
                                                            Paid
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="flex-1 rounded-2xl border border-primary/30 bg-primary/5 p-6 flex flex-col justify-center text-center">
                                        <p className="text-sm font-medium text-text-muted mb-6 leading-relaxed">
                                            You can pay the full remaining balance or enter a custom partial amount in the next step.
                                        </p>
                                        <button 
                                            onClick={() => handlePayClick(activeFee)}
                                            className="w-full py-4 rounded-xl bg-primary hover:bg-primary-hover text-white font-black uppercase tracking-widest text-sm transition-all shadow-lg hover:shadow-primary/25 flex justify-center items-center gap-2"
                                        >
                                            <CreditCard size={18} /> Pay Now
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="glass-card p-20 flex flex-col items-center justify-center text-center text-text-muted">
                        <CreditCard size={64} className="mb-4 opacity-20" />
                        <h3 className="text-xl font-bold text-text-main">No Active Fees</h3>
                        <p className="text-sm font-medium mt-2">You currently do not have any fee structures assigned for the active semester.</p>
                    </div>
                )}
            </div>

            {/* Right Column - Past Records & Payments */}
            <div className="w-full xl:w-96 flex flex-col gap-6 shrink-0">
                <div className="glass-card flex flex-col h-full border border-border-custom/50">
                    <div className="p-6 border-b border-border-custom flex items-center justify-between">
                        <h3 className="text-xl font-black text-text-main uppercase tracking-tight flex items-center gap-2">
                            <Clock className="text-primary" /> Transactions
                        </h3>
                    </div>
                    
                    <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-4">
                        {payments.length > 0 ? payments.map((p) => (
                            <div key={p.id} onClick={() => setReceiptPayment(p)} className="p-4 rounded-xl bg-black/5 dark:bg-white/5 border border-border-custom hover:border-primary/50 transition-colors group cursor-pointer relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Download size={16} className="text-primary" />
                                </div>
                                <div className="flex justify-between items-start mb-2 pr-4">
                                    <div className="truncate">
                                        <h4 className="font-bold text-text-main group-hover:text-primary transition-colors text-sm truncate">
                                            {p.studentFee?.feeStructure?.academicYear || 'Fee Payment'}
                                        </h4>
                                        <p className="text-[10px] text-text-muted font-mono">{p.transactionId}</p>
                                    </div>
                                    <span className="text-emerald-500 font-bold text-sm">+{formatCurrency(p.amountPaid)}</span>
                                </div>
                                <div className="flex justify-between items-end mt-2">
                                    <span className="text-[10px] uppercase font-bold tracking-wider text-text-muted">{p.paymentMethod} • {new Date(p.paymentDate).toLocaleDateString()}</span>
                                    <span className="text-xs text-primary font-medium group-hover:underline">Receipt</span>
                                </div>
                            </div>
                        )) : (
                            <div className="text-center p-10 text-text-muted/50 border border-dashed border-border-custom rounded-2xl flex flex-col items-center justify-center">
                                <p className="text-sm font-medium">No recent transactions.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Modals */}
            {paymentModalOpen && selectedFee && (
                <PaymentModal 
                    fee={selectedFee} 
                    installment={selectedInstallment} 
                    onClose={() => setPaymentModalOpen(false)} 
                    onSuccess={fetchData} 
                />
            )}
            
            {receiptPayment && (
                <ReceiptView 
                    payment={receiptPayment} 
                    onClose={() => setReceiptPayment(null)} 
                />
            )}
        </div>
    );
}
