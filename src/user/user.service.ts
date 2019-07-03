import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository, UpdateResult } from 'typeorm';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { pickProperties } from '../helpers/utils/property-mask';
import { ColumnMetadata } from 'typeorm/metadata/ColumnMetadata';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findById(id: number): Promise<User> {
    return (await this.userRepository.findByIds([id]))[0];
  }

  async findByIdOrFail(id: number): Promise<User> {
    const user: User = await this.findById(id);
    if (!user) {
      throw new NotFoundException();
    }
    return user;
  }

  static initUser(createUserDto: CreateUserDto): User {
    return new User({ ...createUserDto, dateOfBirth: createUserDto.dob });
  }

  async createNew(createUserDto: CreateUserDto): Promise<User> {
    return await this.userRepository.save(UserService.initUser(createUserDto));
  }

  async updateUser(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const updatedUser = UserService.initUser(updateUserDto);
    updatedUser.id = id;

    const maskedUser = pickProperties(
      updatedUser,
      this.userRepository.metadata.columns.map(
        (column: ColumnMetadata) => column.propertyName,
      ),
      {
        gender: 'unknown',
      },
    );
    await this.userRepository.update(id, maskedUser);

    return updatedUser;
  }
}
