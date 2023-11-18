import { Test, TestingModule } from '@nestjs/testing';
import { OrganController } from './organ.controller';

describe('OrganController', () => {
  let controller: OrganController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrganController],
    }).compile();

    controller = module.get<OrganController>(OrganController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
