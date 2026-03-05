import { Module } from '@nestjs/common';
import { BranchesController } from './branches.controller';
import { BranchesService } from './branches.service';
import { AdminBranchesController } from './admin-branches.controller';

@Module({
  controllers: [BranchesController, AdminBranchesController],
  providers: [BranchesService],
  exports: [BranchesService],
})
export class BranchesModule {}
