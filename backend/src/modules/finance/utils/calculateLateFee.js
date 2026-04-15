export const calculateLateFee = (studentFee, feeStructure) => {
    if (!feeStructure || !studentFee) return 0;
    
    // Ensure we are overdue
    if (studentFee.status === 'Paid' || studentFee.status === 'Overdue' && studentFee.fineAmount > 0) {
        // If already paid or already having fine set
        return studentFee.fineAmount || 0;
    }

    const dueDate = new Date(studentFee.dueDate);
    const today = new Date();
    
    if (today <= dueDate) return 0;

    const diffTime = Math.abs(today - dueDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    // lateFeeStartDate means days after dueDate to start charging
    const graceDays = feeStructure.lateFeeStartDate || 0;
    if (diffDays <= graceDays) return 0;

    const penaltyDays = diffDays - graceDays;
    const penaltyPerDay = parseFloat(feeStructure.lateFeePerDay) || 0;
    
    return penaltyDays * penaltyPerDay;
};
