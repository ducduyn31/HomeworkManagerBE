import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './create-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  initUser(createUserDto: CreateUserDto): User {
    return new User({ ...createUserDto, dateOfBirth: createUserDto.dob });
  }

  async createNew(createUserDto: CreateUserDto): Promise<User> {
    return await this.userRepository.save(
      this.initUser(createUserDto),
    );
  }
}
