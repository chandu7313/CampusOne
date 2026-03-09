import React, { useState } from 'react';
import { useStudentFees, usePayFee } from '../../../hooks/useFees';
import { CreditCard, CheckCircle, AlertCircle, Clock, Download, ChevronRight } from 'lucide-react';

const StudentFees = () => {
    const { data: fees, isLoading } = useStudentFees();
    const payMutation = usePayFee();

    const [selectedFeeId, setSelectedFeeId] = useState(null);
    const [paymentAmount, setPaymentAmount] = useState('');
    const [isSimulating, setIsSimulating] = useState(false);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-[60vh]">
                <div className="relative w-20 h-20">
                    <div className="absolute inset-0 border-4 border-primary/20 rounded-full"></div>
                    <div className="absolute inset-0 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                </div>
            </div>
        );
    }

    const currentFee = fees?.[0]; // Assuming the first one is the most current/relevant
    const pastFees = fees?.slice(1) || [];

    const handlePayment = (e) => {
        e.preventDefault();
        if (!selectedFeeId || !paymentAmount) return;

        setIsSimulating(true);
        // Simulate network delay for payment processing
        setTimeout(() => {
            payMutation.mutate({
                studentFeeId: selectedFeeId,
                amount: paymentAmount
            }, {
                onSuccess: () => {
                    alert('Payment processed successfully!');
                    setSelectedFeeId(null);
                    setPaymentAmount('');
                    setIsSimulating(false);
                },
                onError: (error) => {
                    alert(error?.response?.data?.message || 'Payment failed.');
                    setIsSimulating(false);
                }
            });
        }, 1500);
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(amount);
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

                {currentFee ? (
                    <div className="glass-card overflow-hidden">
                        <div className="p-8 pb-0 flex flex-col md:flex-row justify-between items-start gap-6 border-b border-border-custom/50">
                            <div>
                                <div className="flex items-center gap-3 mb-2">
                                    <h2 className="text-3xl font-black text-text-main">Current Semester Fee</h2>
                                    <span className={`px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full flex items-center gap-1.5 ${
                                        currentFee.status === 'Paid' ? 'bg-green-500/10 text-green-500' :
                                        currentFee.status === 'Partial' ? 'bg-orange-500/10 text-orange-500' :
                                        currentFee.status === 'Overdue' ? 'bg-red-500/10 text-red-500' :
                                        'bg-blue-500/10 text-blue-500'
                                    }`}>
                                        {currentFee.status === 'Paid' ? <CheckCircle size={14} /> : 
                                         currentFee.status === 'Overdue' ? <AlertCircle size={14} /> : <Clock size={14} />}
                                        {currentFee.status}
                                    </span>
                                </div>
                                <p className="text-text-muted font-medium mb-6">
                                    Academic Year {currentFee.feeStructure?.academicYear} • Semester {currentFee.feeStructure?.semester}
                                </p>
                            </div>
                            
                            <div className="flex flex-col items-end bg-black/5 dark:bg-white/5 p-4 rounded-2xl w-full md:w-auto">
                                <span className="text-xs uppercase font-bold tracking-widest text-text-muted mb-1">Total Due</span>
                                <span className="text-4xl font-black text-text-main">{formatCurrency(currentFee.totalAmount - currentFee.paidAmount)}</span>
                                <span className="text-sm font-medium text-text-muted mt-1">Due by: {new Date(currentFee.dueDate).toLocaleDateString()}</span>
                            </div>
                        </div>

                        <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-10">
                            
                            {/* Breakdown */}
                            <div>
                                <h3 className="text-lg font-bold text-text-main mb-4 uppercase tracking-wider">Fee Breakdown</h3>
                                <div className="space-y-3 font-medium text-sm">
                                    <div className="flex justify-between items-center p-3 rounded-xl bg-black/5 dark:bg-white/5 border border-border-custom/50">
                                        <span className="text-text-muted">Tuition Fee</span>
                                        <span className="text-text-main font-bold">{formatCurrency(currentFee.feeStructure?.tuitionFee)}</span>
                                    </div>
                                    <div className="flex justify-between items-center p-3 rounded-xl bg-black/5 dark:bg-white/5 border border-border-custom/50">
                                        <span className="text-text-muted">Library Fee</span>
                                        <span className="text-text-main">{formatCurrency(currentFee.feeStructure?.libraryFee)}</span>
                                    </div>
                                    <div className="flex justify-between items-center p-3 rounded-xl bg-black/5 dark:bg-white/5 border border-border-custom/50">
                                        <span className="text-text-muted">Lab Fee</span>
                                        <span className="text-text-main">{formatCurrency(currentFee.feeStructure?.labFee)}</span>
                                    </div>
                                    <div className="flex justify-between items-center p-3 rounded-xl bg-black/5 dark:bg-white/5 border border-border-custom/50">
                                        <span className="text-text-muted">Other Fees</span>
                                        <span className="text-text-main">{formatCurrency(currentFee.feeStructure?.otherFees)}</span>
                                    </div>
                                </div>
                                
                                <div className="mt-6 pt-4 border-t border-border-custom flex justify-between items-center">
                                    <span className="text-sm font-bold uppercase tracking-wider text-text-muted">Total Amount</span>
                                    <span className="text-xl font-black text-text-main">{formatCurrency(currentFee.totalAmount)}</span>
                                </div>
                                <div className="mt-2 flex justify-between items-center text-green-500">
                                    <span className="text-sm font-bold uppercase tracking-wider">Amount Paid</span>
                                    <span className="text-lg font-black">{formatCurrency(currentFee.paidAmount)}</span>
                                </div>
                            </div>

                            {/* Payment Section */}
                            <div className="flex flex-col">
                                <h3 className="text-lg font-bold text-text-main mb-4 uppercase tracking-wider">Make Payment</h3>
                                
                                {currentFee.status === 'Paid' ? (
                                    <div className="flex-1 rounded-2xl border-2 border-dashed border-green-500/30 bg-green-500/5 flex flex-col items-center justify-center p-6 text-center text-green-500/80">
                                        <CheckCircle size={48} className="mb-4 opacity-50" />
                                        <h4 className="text-lg font-bold">All Cleared</h4>
                                        <p className="text-sm font-medium mt-1">You have fully paid the fees for this semester.</p>
                                    </div>
                                ) : (
                                    <div className="flex-1 rounded-2xl border border-primary/30 bg-primary/5 p-6 flex flex-col">
                                        <p className="text-sm font-medium text-text-muted mb-4 leading-relaxed">
                                            Select "Pay Now" to simulate a transaction. You can choose to pay the full amount or a partial installment.
                                        </p>
                                        
                                        <form onSubmit={handlePayment} className="mt-auto flex flex-col gap-4">
                                            <div className="relative">
                                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted font-bold">₹</span>
                                                <input 
                                                    type="number" 
                                                    required
                                                    min="1"
                                                    max={currentFee.totalAmount - currentFee.paidAmount}
                                                    className="w-full bg-background border border-border-custom rounded-xl py-3 pl-8 pr-4 text-text-main font-bold outline-none focus:border-primary transition-colors"
                                                    placeholder="Amount to pay"
                                                    value={paymentAmount}
                                                    onChange={(e) => {
                                                        setSelectedFeeId(currentFee.id);
                                                        setPaymentAmount(e.target.value);
                                                    }}
                                                />
                                            </div>
                                            <button 
                                                type="submit"
                                                disabled={isSimulating || !paymentAmount}
                                                className="w-full py-4 rounded-xl bg-primary hover:bg-primary-hover text-white font-black uppercase tracking-widest text-sm transition-all shadow-lg hover:shadow-primary/25 flex justify-center items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                {isSimulating ? (
                                                    <>Processing <span className="animate-spin relative w-4 h-4 border-2 border-white/30 border-t-white rounded-full"></span></>
                                                ) : (
                                                    <><CreditCard size={18} /> Pay Now</>
                                                )}
                                            </button>
                                        </form>
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

            {/* Right Column - Past Records */}
            <div className="w-full xl:w-96 flex flex-col gap-6 shrink-0">
                <div className="glass-card p-6 flex flex-col h-full border border-border-custom/50">
                    <h3 className="text-xl font-black text-text-main uppercase tracking-tight mb-6 flex items-center gap-2">
                        <Clock className="text-primary" /> Past Records
                    </h3>
                    
                    <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 space-y-4">
                        {pastFees.length > 0 ? pastFees.map((fee) => (
                            <div key={fee.id} className="p-4 rounded-xl bg-black/5 dark:bg-white/5 border border-border-custom hover:border-text-muted/30 transition-colors group cursor-pointer relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Download size={16} className="text-primary" />
                                </div>
                                <div className="flex justify-between items-start mb-2 pr-4">
                                    <div>
                                        <h4 className="font-bold text-text-main group-hover:text-primary transition-colors">Semester {fee.feeStructure?.semester}</h4>
                                        <p className="text-xs text-text-muted font-medium">{fee.feeStructure?.academicYear}</p>
                                    </div>
                                    <span className={`px-2 py-0.5 text-[0.6rem] font-bold uppercase tracking-wider rounded ${
                                        fee.status === 'Paid' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'
                                    }`}>
                                        {fee.status}
                                    </span>
                                </div>
                                <div className="flex justify-between items-end mt-4">
                                    <span className="text-xs text-text-muted font-medium">Receipt Available</span>
                                    <span className="font-bold text-text-main">{formatCurrency(fee.totalAmount)}</span>
                                </div>
                            </div>
                        )) : (
                            <div className="text-center p-10 text-text-muted/50 border border-dashed border-border-custom rounded-2xl h-full flex flex-col items-center justify-center">
                                <p className="text-sm font-medium">No past fee records found.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

        </div>
    );
};

export default StudentFees;
