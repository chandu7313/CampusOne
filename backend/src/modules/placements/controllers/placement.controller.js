import { PlacementOpportunity, PlacementApplication, User } from '../../../models/index.js';
import catchAsync from '../../../utils/catchAsync.js';
import AppError from '../../../utils/appError.js';
import { Op } from 'sequelize';

/**
 * Get all open placement opportunities (Student/Faculty/Admin)
 */
export const getOpportunities = catchAsync(async (req, res, next) => {
    const opportunities = await PlacementOpportunity.findAll({
        where: { status: 'Open' },
        order: [['lastDateToApply', 'ASC']]
    });

    res.status(200).json({ status: 'success', results: opportunities.length, data: opportunities });
});

/**
 * STUDENT: Apply for a placement opportunity
 */
export const applyToOpportunity = catchAsync(async (req, res, next) => {
    const { opportunityId, resumeUrl, notes } = req.body;
    const studentId = req.user.id;

    // Check if opportunity exists and is open
    const opportunity = await PlacementOpportunity.findByPk(opportunityId);
    if (!opportunity || opportunity.status !== 'Open') {
        return next(new AppError('This opportunity is no longer accepting applications.', 400));
    }

    // Check for duplicate application
    const existing = await PlacementApplication.findOne({ where: { opportunityId, studentId } });
    if (existing) return next(new AppError('You have already applied for this opportunity.', 400));

    const application = await PlacementApplication.create({
        opportunityId,
        studentId,
        resumeUrl,
        notes
    });

    res.status(201).json({ status: 'success', data: application });
});

/**
 * STUDENT: Get my applications
 */
export const getMyApplications = catchAsync(async (req, res, next) => {
    const applications = await PlacementApplication.findAll({
        where: { studentId: req.user.id },
        include: [{ model: PlacementOpportunity, as: 'opportunity' }],
        order: [['createdAt', 'DESC']]
    });

    res.status(200).json({ status: 'success', results: applications.length, data: applications });
});

/**
 * FACULTY/ADMIN: Create a new opportunity
 */
export const createOpportunity = catchAsync(async (req, res, next) => {
    const opportunity = await PlacementOpportunity.create(req.body);
    res.status(201).json({ status: 'success', data: opportunity });
});

/**
 * FACULTY/ADMIN: View applications for an opportunity
 */
export const getOpportunityApplications = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const applications = await PlacementApplication.findAll({
        where: { opportunityId: id },
        include: [{ model: User, as: 'student', attributes: ['firstName', 'lastName', 'email'] }]
    });

    res.status(200).json({ status: 'success', results: applications.length, data: applications });
});

/**
 * FACULTY/ADMIN: Update application status (Shortlist/Reject/etc)
 */
export const updateApplicationStatus = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const { status, notes } = req.body;

    const application = await PlacementApplication.findByPk(id);
    if (!application) return next(new AppError('Application not found', 404));

    application.status = status;
    if (notes) application.notes = notes;
    await application.save();

    res.status(200).json({ status: 'success', data: application });
});

/**
 * Get recent placement records for display
 */
export const getRecentPlacements = catchAsync(async (req, res, next) => {
    res.status(200).json({
        status: 'success',
        data: records
    });
});
