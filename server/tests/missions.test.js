const request = require('supertest');
const app = require('../app');
const missionsRepository = require('../repositories/missionsRepository');
const { ServerError } = require('../errors/errors');

jest.mock('../repositories/missionsRepository');

// Get all missions test
describe('GET /missions', () => {
  beforeEach(() => jest.clearAllMocks());

  // success 200
  it('should return all missions', async () => {
    const mockMissions = [{
      missionId: '65f2de405148ef9ba362d1fa',
      missionType: 'GUARD',
      startDate: '12/02/2024 6:00',
      endDate: '12/02/2024 10:00',
      soldierCount: 2,
      soldiersOnMission: [],
    },
    {
      missionId: '65f2d33a68583409daedeb0a',
      missionType: 'GUARD',
      startDate: '12/02/2024 14:00',
      endDate: '12/02/2024 18:00',
      soldierCount: 2,
      soldiersOnMission: [],
    }];

    missionsRepository.findMissions.mockResolvedValue(mockMissions);
    const res = await request(app).get('/missions');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual(mockMissions);
  });

  // not found 404
  it('Should return 404 when there are no missions', async () => {
    missionsRepository.findMissions.mockResolvedValue([]);
    const res = await request(app).get('/missions');
    expect(res.statusCode).toEqual(404);
  });

  // server error 500
  it('should return 500 when there is a server error', async () => {
    missionsRepository.findMissions.mockRejectedValue(new ServerError());
    const res = await request(app).get('/missions');
    expect(res.statusCode).toEqual(500);
  });
});

// Get mission by id test
describe('GET /missions/:missionId', () => {
  beforeEach(() => jest.clearAllMocks());

  // success 200
  it('should return mission with specific _id', async () => {
    const mockMissions = [{
      missionId: '65f2de405148ef9ba362d1fa',
      missionType: 'GUARD',
      startDate: '12/02/2024 6:00',
      endDate: '12/02/2024 10:00',
      soldierCount: 2,
      soldiersOnMission: [],
    },
    {
      missionId: '65f2d33a68583409daedeb0a',
      missionType: 'GUARD',
      startDate: '12/02/2024 14:00',
      endDate: '12/02/2024 18:00',
      soldierCount: 2,
      soldiersOnMission: [],
    }];

    missionsRepository.retrieveMission.mockResolvedValue(mockMissions[0]);
    const res = await request(app).get('/missions/65f2de405148ef9ba362d1fa');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual(mockMissions[0]);
  });

  // not found 404
  it('Should return 404 when the missions doesnt exists', async () => {
    missionsRepository.retrieveMission.mockResolvedValue([]);
    const res = await request(app).get('/missions/65f2d0d3973aba4afd6b3f14');
    expect(res.statusCode).toEqual(404);
  });

  // id not in the currect format
  it('Should return 400 when id not in the currect format', async () => {
    missionsRepository.retrieveMission.mockResolvedValue([]);
    const res = await request(app).get('/missions/123');
    expect(res.statusCode).toEqual(400);
  });

  // server error 500
  it('should return 500 when there is a server error', async () => {
    missionsRepository.retrieveMission.mockRejectedValue(new ServerError());
    const res = await request(app).get('/missions/65f2de405148ef9ba362d1fa');
    expect(res.statusCode).toEqual(500);
  });
});

// post new mission
describe('POST /missions', () => {
  beforeEach(() => jest.clearAllMocks());

  // success 200
  it('should return 200', async () => {
    const mockMissions = {
      missionType: 'GUARD',
      startDate: '12/02/2024 14:00',
      endDate: '12/02/2024 18:00',
      soldierCount: 2,
      soldiersOnMission: [],
    };

    missionsRepository.createMission.mockResolvedValue(mockMissions);
    const res = await request(app).post('/missions/').send(mockMissions);
    expect(res.statusCode).toEqual(200);
  });

  // should return 400 - missing arguments
  it('Should return 400 when missing argumet', async () => {
    const mockMissions = {
      missionType: 'GUARD',
      startDate: '12/02/2024 14:00',
      endDate: '12/02/2024 18:00',
      soldiersOnMission: [],
    };

    missionsRepository.createMission.mockResolvedValue(mockMissions);
    const res = await request(app).post('/missions/').send(mockMissions);
    expect(res.statusCode).toEqual(400);
  });

  // should return 400 - empty body
  it('Should return 400 when missing argumet', async () => {
    missionsRepository.createMission.mockResolvedValue([]);
    const res = await request(app).post('/missions/').send();
    expect(res.statusCode).toEqual(400);
  });

  // server error 500
  it('should return 500 when there is a server error', async () => {
    const mockMissions = {
      missionId: '65f2d33a68583409daedeb0a',
      missionType: 'GUARD',
      startDate: '12/02/2024 14:00',
      endDate: '12/02/2024 18:00',
      soldierCount: 2,
      soldiersOnMission: [],
    };

    missionsRepository.createMission.mockRejectedValue(new ServerError());
    const res = await request(app).post('/missions/').send(mockMissions);
    expect(res.statusCode).toEqual(500);
  });
});

// post new missions
describe('POST /missions', () => {
  beforeEach(() => jest.clearAllMocks());

  // success 200
  it('should return 200', async () => {
    const mockMissions = [{
      missionId: '65f2de405148ef9ba362d1fa',
      missionType: 'GUARD',
      startDate: '12/02/2024 6:00',
      endDate: '12/02/2024 10:00',
      soldierCount: 2,
      soldiersOnMission: [],
    },
    {
      missionId: '65f2d33a68583409daedeb0a',
      missionType: 'GUARD',
      startDate: '12/02/2024 14:00',
      endDate: '12/02/2024 18:00',
      soldierCount: 2,
      soldiersOnMission: [],
    }];

    missionsRepository.createMissions.mockResolvedValue(mockMissions);
    const res = await request(app).post('/missions/').send(mockMissions);
    expect(res.statusCode).toEqual(200);
  });

  // should return 400 - missing arguments
  it('Should return 400 when missing argumet', async () => {
    const mockMissions = {
      missionType: 'GUARD',
      startDate: '12/02/2024 14:00',
      endDate: '12/02/2024 18:00',
      soldiersOnMission: [],
    };

    missionsRepository.createMissions.mockResolvedValue(mockMissions);
    const res = await request(app).post('/missions/').send(mockMissions);
    expect(res.statusCode).toEqual(400);
  });

  // should return 400 - empty body
  it('Should return 400 when missing argumet', async () => {
    missionsRepository.createMissions.mockResolvedValue([]);
    const res = await request(app).post('/missions/').send([]);
    expect(res.statusCode).toEqual(400);
  });

  it('should return 500 when there is a server error', async () => {
    const mockMissions = {
      missionId: '65f2d33a68583409daedeb0a',
      missionType: 'GUARD',
      startDate: '12/02/2024 14:00',
      endDate: '12/02/2024 18:00',
      soldierCount: 2,
      soldiersOnMission: [],
    };

    missionsRepository.createMission.mockRejectedValue(new ServerError());
    const res = await request(app).post('/missions/').send(mockMissions);
    expect(res.statusCode).toEqual(500);
  });
});

describe('DELETE /missions/:missionId', () => {
  beforeEach(() => jest.clearAllMocks());

  // success 200
  it('should return 200', async () => {
    const mockMissions = [{
      missionId: '65f2de405148ef9ba362d1fa',
      missionType: 'GUARD',
      startDate: '12/02/2024 6:00',
      endDate: '12/02/2024 10:00',
      soldierCount: 2,
      soldiersOnMission: [],
    },
    {
      missionId: '65f2d33a68583409daedeb0a',
      missionType: 'GUARD',
      startDate: '12/02/2024 14:00',
      endDate: '12/02/2024 18:00',
      soldierCount: 2,
      soldiersOnMission: [],
    }];

    missionsRepository.deleteMission.mockResolvedValue(mockMissions);
    const res = await request(app).delete('/missions/65f2de405148ef9ba362d1fa');
    expect(res.statusCode).toEqual(200);
  });

  // should return 400 - id not in the currect format
  it('Should return 400 when id not in the currect format', async () => {
    missionsRepository.deleteMission.mockResolvedValue([]);
    const res = await request(app).delete('/missions/123');
    expect(res.statusCode).toEqual(400);
  });

  // should return 404 - id not found
  it('Should return 404 when id not found', async () => {
    missionsRepository.deleteMission.mockResolvedValue([]);
    const res = await request(app).delete('/missions/5f882587d4d1c02da0f64c8b');
    expect(res.statusCode).toEqual(404);
  });

  // server error 500
  it('should return 500 when there is a server error', async () => {
    missionsRepository.deleteMission.mockRejectedValue(new ServerError());
    const res = await request(app).delete('/missions/5f882587d4d1c02da0f64c8b');
    expect(res.statusCode).toEqual(500);
  });
});

describe('PUT /missions/:missionId', () => {
  beforeEach(() => jest.clearAllMocks());

  // success 200
  it('should return 200 - mission updated', async () => {
    const mockMissions = {
      missionId: '65f2d33a68583409daedeb0a',
      missionType: 'GUARD',
      startDate: '12/02/2024 14:00',
      endDate: '12/02/2024 18:00',
      soldierCount: 2,
      soldiersOnMission: [],
    };

    missionsRepository.updateMission.mockResolvedValue(mockMissions);
    const res = await request(app).put('/missions/65f2d33a68583409daedeb0a').send(mockMissions);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual(mockMissions);
  });

  // should return 400 - id not in the currect format
  it('Should return 400 when id not in the currect format', async () => {
    missionsRepository.updateMission.mockResolvedValue([]);
    const res = await request(app).put('/missions/123').send([]);
    expect(res.statusCode).toEqual(400);
  });

  // should return 404 - id not found
  it('Should return 404 when id not found', async () => {
    const mockMissions = {
      missionId: '65f2d33a68583409daedeb0a',
      missionType: 'GUARD',
      startDate: '12/02/2024 14:00',
      endDate: '12/02/2024 18:00',
      soldierCount: 2,
      soldiersOnMission: [],
    };
    missionsRepository.updateMission.mockResolvedValue([]);
    const res = await request(app).put('/missions/5f882587d4d1c02da0f64c8b').send(mockMissions);
    expect(res.statusCode).toEqual(404);
  });

  // server error 500
  it('should return 500 when there is a server error', async () => {
    const mockMissions = {
      missionId: '65f2d33a68583409daedeb0a',
      missionType: 'GUARD',
      startDate: '12/02/2024 14:00',
      endDate: '12/02/2024 18:00',
      soldierCount: 2,
      soldiersOnMission: [],
    };

    missionsRepository.updateMission.mockRejectedValue(new ServerError());
    const res = await request(app).put('/missions/5f882587d4d1c02da0f64c8b').send(mockMissions);
    expect(res.statusCode).toEqual(500);
  });
});
