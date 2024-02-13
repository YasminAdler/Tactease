const {
    findRequests,
    retrieveRequest,
    createRequest,
    updateRequest,
    deleteRequest,
} = require('../repository/reports.repository');
const { EntityNotFoundError, PropertyNotFoundError, BadRequestError } = require('../errors/errors');

exports.reportsController = {
    async getAllRequests(req, res, next) {
        try {
            const requests = await findReports();
            if (!requests || requests.length === 0) throw new EntityNotFoundError('reports');
            res.status(200).json(requests);
        } catch (error) {
            next(error);
        }
    },

    async getRequestById(req, res, next) {
        const { requestId } = req.params;
        try {
            const isId = mongoose.isValidObjectId(requestId);
            if (!isId) throw new BadRequestError('id');
            const request = await retrieveReport(requestId);
            if (!request || request.length === 0) throw new EntityNotFoundError(`Report with id <${requestId}>`);
            res.status(200).json(report);
        } catch (error) {
            next(error);
        }
    },

    async createRequest(req, res, next) {
        try {
            if (Object.keys(req.body).length === 0) throw new BadRequestError('create');
            const {
                requestType, daysOffType, startDate, endDate,
            } = req.body;
            if (
                !requestType
                || !daysOffType
                || !startDate
                || !endDate
            ) throw new PropertyNotFoundError('create - missing arguments');
            const request = await createReport(req.body);
            res.status(200).json(request);
        } catch (error) {
            if (error.name === 'ValidationError') {
                error.status = 400;
            }
            next(error);
        }
    },


    async deleteReport(req, res, next) {
        try {
            const { requestId } = req.params;
            const isId = mongoose.isValidObjectId(requestId);
            if (!isId) throw new BadRequestError('id');
            const request = await deleteReport(requestId);
            if (!request || request.length === 0) throw new EntityNotFoundError(`Request with id <${requestId}>`);
            res.status(200).json(request);
        } catch (error) {
            if (error.name === 'ValidationError') {
                error.status = 400;
            }
            next(error);
        }
    },

    async updateReport(req, res, next) {
        try {
            const { requestId } = req.params;
            const isId = mongoose.isValidObjectId(requestId);
            if (!isId) throw new BadRequestError('id');
            if (Object.keys(req.body).length === 0) throw new BadRequestError('update');
            const report = await updateReport(reportId, req.body);
            if (!report || report.length === 0) throw new EntityNotFoundError(`Report with id <${requestId}>`);
            res.status(200).json(report);
        } catch (error) {
            next(error);
        }
    },
}
