jest.mock('axios');
const axios = require('axios');
const { algorithmController } = require('../controllers/algorithmController');

// Mock data
const mockRequestData = {
  missions: [{ /* mission details */ }],
  soldiers: [{ /* soldier details */ }]
};
const mockResponseData = { /* expected response */ };

describe('Algorithm Controller', () => {
  it('should generate schedule correctly', async () => {
    axios.post.mockResolvedValue({ data: mockResponseData });

    // Mock Express request and response
    const req = { body: mockRequestData };
    const res = { json: jest.fn(), status: jest.fn().mockReturnThis() };
    const next = jest.fn();

    await algorithmController.generateSchedule(req, res, next);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(mockResponseData);
  });
});
