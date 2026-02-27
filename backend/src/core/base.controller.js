import catchAsync from '../utils/catchAsync.js';

class BaseController {
    constructor(service) {
        this.service = service;
    }

    getAll = catchAsync(async (req, res) => {
        const items = await this.service.getAll();
        res.status(200).json({ status: 'success', data: items });
    });

    getById = catchAsync(async (req, res) => {
        const item = await this.service.getById(req.params.id);
        if (!item) {
            return res.status(404).json({ status: 'fail', message: 'Not found' });
        }
        res.status(200).json({ status: 'success', data: item });
    });

    create = catchAsync(async (req, res) => {
        const item = await this.service.create(req.body);
        res.status(201).json({ status: 'success', data: item });
    });
}

export default BaseController;
