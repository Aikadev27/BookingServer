import { SetMetadata } from '@nestjs/common/decorators/core';

export const Roles = (...roles: string[]) => SetMetadata('roles', roles);
