import { Injectable, NotFoundException } from '@nestjs/common';
import { User } from './user.entity';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { pickProperties } from '../helpers/utils/property-mask';
import { ColumnMetadata } from 'typeorm/metadata/ColumnMetadata';
import { SoftDeleteRepository } from '../helpers/traits/soft-delete';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: SoftDeleteRepository<User>) {}

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

  async deleteOrFail(id: number) {
    const deleteResult = await this.userRepository.delete(id);
    const LastCharIndexOfRowsMatched = 14;
    if (
      +deleteResult.raw.message.slice(
        LastCharIndexOfRowsMatched,
        deleteResult.raw.message.indexOf('Changed:'),
      ) === 0
    ) {
      throw new NotFoundException();
    }
    return (await this.userRepository.findByIds([id], {}, true))[0];
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
