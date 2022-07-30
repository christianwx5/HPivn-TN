import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ObjectId, PaginateModel, PaginateResult } from 'mongoose';

import { IPaginationOptions, IPaginationQuery } from '../interfaces';
import { ComparePassword, HashPassword, queriesFilter } from '../libs';
import { CreateUserDTO, UpdateUserDTO } from './dto';
import { User, UserDocument } from './schema/user.schema';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name)
    private userModel: PaginateModel<UserDocument>,
  ) {}

  async create(user: CreateUserDTO): Promise<User> {
    try {
      const exists = await this.userModel
        .findOne({
          email: user.email,
        })
        .count();
      if (exists === 1) throw new ConflictException();

      user.password = await HashPassword(user.password);

      const newUser = new this.userModel(user);

      return newUser.save();
    } catch (error) {
      if (error.status === 409)
        throw new ConflictException('Este correo ya se encuentra registrado');

      throw new InternalServerErrorException(error);
    }
  }

  async findAll(
    queries: IPaginationQuery,
    options: IPaginationOptions,
  ): Promise<PaginateResult<UserDocument>> {
    try {
      if (queries.name) queries.name = RegExp(queries.name, 'i');
      if (queries.surname) queries.surname = RegExp(queries.surname, 'i');

      const query = queriesFilter(queries);

      const newOptions = {
        ...options,
        select: '-password -refreshToken -__v',
      };

      return await this.userModel.paginate(query, newOptions);
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async findOne(email: string): Promise<UserDocument> {
    try {
      const user = await this.userModel.findOne({ email });
      if (!user) throw new NotFoundException();

      return user;
    } catch (error) {
      if (error.status === 404)
        throw new NotFoundException('El usuario no se encuentra registrado');

      throw new InternalServerErrorException(error);
    }
  }

  async updateOnLogin(id: ObjectId): Promise<void> {
    try {
      await this.userModel.findByIdAndUpdate(
        id,
        {
          lastLogin: Date.now(),
        },
        { new: true },
      );
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async findOneById(id: ObjectId): Promise<UserDocument> {
    try {
      const user: any = await this.userModel.findOne({ _id: id });
      if (!user) throw new NotFoundException();

      const { password, refreshToken, __v, ...result } = user._doc;

      return result;
    } catch (error) {
      if (error.status === 404)
        throw new NotFoundException('El usuario no se encuentra registrado');

      throw new InternalServerErrorException(error);
    }
  }

  async update(
    id: ObjectId,
    updatedUser: UpdateUserDTO,
  ): Promise<UserDocument> {
    try {
      const user = await this.userModel.findById(id);
      if (!user) throw new NotFoundException();

      if (updatedUser.password && updatedUser.password.trim().length !== 0) {
        updatedUser.password = await HashPassword(updatedUser.password);
      } else {
        updatedUser.password = user.password;
      }

      const updated: any = await this.userModel.findByIdAndUpdate(
        id,
        {
          $set: updatedUser,
        },
        { new: true, upsert: true },
      );

      const { password, refreshToken, __v, ...result } = updated._doc;

      return result;
    } catch (error) {
      if (error.status === 404)
        throw new NotFoundException(
          'El usuario que intenta actualizar no existe!',
        );
      throw new InternalServerErrorException(error);
    }
  }

  async delete(id: ObjectId): Promise<UserDocument> {
    try {
      return await this.userModel.findByIdAndDelete(id);
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async setCurrentRefreshToken(
    refreshToken: string,
    id: ObjectId,
  ): Promise<void> {
    try {
      const currentHashedRefreshToken = await HashPassword(refreshToken);
      await this.userModel.updateOne(
        { _id: id },
        { $set: { refreshToken: currentHashedRefreshToken } },
      );
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async getUserIfRefreshTokenMatches(
    refreshToken: string,
    id: ObjectId,
  ): Promise<UserDocument> {
    try {
      const isUserFound = await this.userModel.findById(id);
      const isRefreshTokenMatching = await ComparePassword(
        isUserFound.refreshToken,
        refreshToken,
      );

      if (isRefreshTokenMatching) return isUserFound;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async removeRefreshToken(id: ObjectId): Promise<boolean> {
    try {
      const logoutReponse = await this.userModel
        .updateOne({ _id: id }, { $set: { refreshToken: null } })
        .count();

      if (logoutReponse > 0) return true;
      else return false;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async getUserPermissions(id: ObjectId): Promise<UserDocument> {
    try {
      return await this.userModel.findById(id).select('permissions -_id');
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}
