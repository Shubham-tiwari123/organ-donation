import { Test, TestingModule } from '@nestjs/testing';
import { OrganService } from './organ.service';

describe('OrganService', () => {
  let service: OrganService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OrganService],
    }).compile();

    service = module.get<OrganService>(OrganService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
