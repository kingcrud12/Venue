import { Test, TestingModule } from '@nestjs/testing';
import { EchoService } from './echo.service';

describe('EchoService', () => {
  let service: EchoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EchoService],
    }).compile();

    service = module.get<EchoService>(EchoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
