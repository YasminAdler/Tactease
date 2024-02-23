const request = require('supertest');
const app = require('../app');
const missionsRepository = require('../repositories/missionsRepository');
const { ServerError } = require('../errors/errors');

jest.mock('../repositories/missionsRepository');

// Get all reports test
describe('GET /missions', () => {
  beforeEach(() => jest.clearAllMocks());

  // Success 200
  it('should return all reports', async () => {
    const mockMissions = [
      {
        _id: '65cb898dd3d4f813d140f810',
        missionType: 'PATROL_BY_FOOT',
        startDate: '12/02/2024 14:00',
        endDate: '12/02/2024 16:00',
        soldierCount: 4,
        soldiersOnMission: [],
      },
      {
        _id: '65cb898dd3d4f813d140f814',
        startDate: '12/02/2024 16:00',
        endDate: '12/02/2024 20:00',
        soldierCount: 6,
        soldiersOnMission: [],
      },
    ];
    missionsRepository.findMissions.mockResolvedValue(mockMissions);

    const res = await request(app).get('/missions');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual(mockMissions);
  });

  // Failure 404
  it('should return 404 when no reports are found', async () => {
    const mockMissions = [];
    missionsRepository.findMissions.mockResolvedValue(mockMissions);

    const res = await request(app).get('/missions');
    expect(res.statusCode).toEqual(404);
  });

  // Failure 500
  it('should return 500 when an error occurs', async () => {
    missionsRepository.findMissions.mockRejectedValue(new ServerError('internal server error'));

    const res = await request(app).get('/missions');
    expect(res.statusCode).toEqual(500);
  });
});

// Get report by id
describe('GET /missions/:missionId', () => {
  beforeEach(() => jest.clearAllMocks());

  // Success 200
  it('should return report with specific id', async () => {
    const mockMissions = [
      {
        _id: '65cb898dd3d4f813d140f810',
        missionType: 'PATROL_BY_FOOT',
        startDate: '12/02/2024 14:00',
        endDate: '12/02/2024 16:00',
        soldierCount: 4,
        soldiersOnMission: [],
      },
      {
        _id: '65cb898dd3d4f813d140f814',
        startDate: '12/02/2024 16:00',
        endDate: '12/02/2024 20:00',
        soldierCount: 6,
        soldiersOnMission: [],
      },
    ];

    missionsRepository.retrieveMission.mockResolvedValue(mockMissions[0]);

    const res = await request(app).get('/missions/65cb898dd3d4f813d140f810');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual(mockMissions[0]);
  });

  // Failure 404
  it('should return 404 if id wasnt found', async () => {
    const mockMissions = [
      {
        _id: '65cb898dd3d4f813d140f810',
        missionType: 'PATROL_BY_FOOT',
        startDate: '12/02/2024 14:00',
        endDate: '12/02/2024 16:00',
        soldierCount: 4,
        soldiersOnMission: [],
      },
      {
        _id: '65cb898dd3d4f813d140f814',
        startDate: '12/02/2024 16:00',
        endDate: '12/02/2024 20:00',
        soldierCount: 6,
        soldiersOnMission: [],
      },
    ];
    missionsRepository.retrieveMission.mockResolvedValue(mockMissions[14]);

    const res = await request(app).get('/missions/5f882587d4d1c02da0f64c8b');
    expect(res.statusCode).toEqual(404);
  });

  // Failure 404
  it('should return 404 if id isnt by the format', async () => {
    const mockMissions = [];
    missionsRepository.retrieveMission.mockResolvedValue(mockMissions);

    const res = await request(app).get('/missions/dsfdsfs');
    expect(res.statusCode).toEqual(400);
  });

  // Failure 500
  it('should return 500 when an error occurs', async () => {
    missionsRepository.retrieveMission.mockRejectedValue(new ServerError('internal server error'));

    const res = await request(app).get('/missions/5f882587d4d1c02da0f64c8b');
    expect(res.statusCode).toEqual(500);
  });
});

// Create new report
describe('POST /missions', () => {
  beforeEach(() => jest.clearAllMocks());

  // Success 200
  it('should return 200', async () => {
    const mockMissions = {
      missionType: 'PATROL_BY_FOOT',
      startDate: '12/02/2024 14:00',
      endDate: '12/02/2024 16:00',
      soldierCount: 4,
      soldiersOnMission: [],
    };
    missionsRepository.createMission.mockResolvedValue(mockMissions);

    const res = await request(app).post('/missions').send(mockMissions);
    expect(res.statusCode).toEqual(200);
  });

  // Failure 400
  it('missing argument - should return 400', async () => {
    const mockMissions = {
      missionType: 'PATROL_BY_FOOT',
      soldierCount: 4,
      soldiersOnMission: [],
    };
    missionsRepository.createMission.mockResolvedValue(mockMissions);

    const res = await request(app).post('/missions').send(mockMissions);
    expect(res.statusCode).toEqual(400);
  });

  // Failure 400
  it('empty request body - should return 400', async () => {
    const mockMissions = { };
    missionsRepository.createMission.mockResolvedValue(mockMissions);

    const res = await request(app).post('/missions').send(mockMissions);
    expect(res.statusCode).toEqual(400);
  });
});

// Delete exiting report
describe('DELETE /missions/:missionId', () => {
  beforeEach(() => jest.clearAllMocks());

  // Success 200
  it('should return deleted report with specific id', async () => {
    const mockMissions = [
      {
        _id: '65cb898dd3d4f813d140f810',
        missionType: 'PATROL_BY_FOOT',
        startDate: '12/02/2024 14:00',
        endDate: '12/02/2024 16:00',
        soldierCount: 4,
        soldiersOnMission: [],
      },
      {
        _id: '65cb898dd3d4f813d140f814',
        startDate: '12/02/2024 16:00',
        endDate: '12/02/2024 20:00',
        soldierCount: 6,
        soldiersOnMission: [],
      },
    ];

    missionsRepository.deleteMission.mockResolvedValue(mockMissions);

    const res = await request(app).delete('/missions/65cb898dd3d4f813d140f814');
    expect(res.statusCode).toEqual(200);
  });

  // Failure 404
  it('should return 404 if id wasnt found', async () => {
    missionsRepository.deleteMission.mockResolvedValue(null);

    const res = await request(app).delete('/missions/65d7580f7e065995954e8504');
    expect(res.statusCode).toEqual(404);
  });

  // Failure 400
  it('should return 400 if id isnt by the format', async () => {
    const mockMissions = [];
    missionsRepository.deleteMission.mockResolvedValue(mockMissions);

    const res = await request(app).delete('/missions/fdsfs');
    expect(res.statusCode).toEqual(400);
  });

  // Failure 500
  it('should return 500 when an error occurs', async () => {
    missionsRepository.deleteMission.mockRejectedValue(new ServerError('internal server error'));

    const res = await request(app).delete('/missions/1');
    expect(res.statusCode).toEqual(500);
  });
});

// Update exiting report
describe('PUT /missions/:missionId', () => {
  beforeEach(() => jest.clearAllMocks());

  // Success 200
  it('should return updated report with specific id', async () => {
    const mockMissions = {
      _id: '65cb898dd3d4f813d140f810',
      missionType: 'PATROL_BY_FOOT',
      startDate: '12/02/2024 14:00',
      endDate: '12/02/2024 16:00',
      soldierCount: 4,
      soldiersOnMission: [],
    };

    missionsRepository.updateMission.mockResolvedValue(mockMissions);

    const res = await request(app).put('/missions/65cb898dd3d4f813d140f810').send(mockMissions);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual(mockMissions);
  });

  // Failure 404
  it('should return 404 if id wasnt found', async () => {
    const mockMissions = {
      missionId: 1,
      missionType: 'GUARD',
      startDate: '12/02/2024 6:00',
      endDate: '12/02/2024 10:00',
      soldierCount: 2,
      soldiersOnMission: [],
    };

    missionsRepository.updateMission.mockResolvedValue(null);

    const res = await request(app).put('/missions/65d7580f7e065995954e8504').send(mockMissions);
    expect(res.statusCode).toEqual(404);
  });

  // Failure 400
  it('should return 400 if id isnt by the format', async () => {
    const mockMissions = [];
    missionsRepository.updateMission.mockResolvedValue(mockMissions);

    const res = await request(app).put('/missions/1523').send(mockMissions);
    expect(res.statusCode).toEqual(400);
  });

  // Failure 400
  it('empty request body - should return 400', async () => {
    const mockMissions = { };
    missionsRepository.updateMission.mockResolvedValue(mockMissions);

    const res = await request(app).put('/missions/hjgg').send(mockMissions);
    expect(res.statusCode).toEqual(400);
  });
});
