import {
    ConflictException,
    Injectable,
    InternalServerErrorException,
    NotFoundException,
  } from '@nestjs/common';
  import { InjectModel } from '@nestjs/mongoose';
  import { Model, ObjectId, UpdateWriteOpResult } from 'mongoose';
  import { CreateCategoryDTO, UpdateCategoryDTO } from './dtos';
  
  import { Category, CategoryDocument } from './schema/category.schema';

@Injectable()
export class CategoriesService {

    constructor(
        @InjectModel(Category.name)
        private categoryModel: Model<CategoryDocument>,
        // private readonly utils: Utils
    ) {}
      
    async findAll(): Promise<any[]> {
        try {
          return this.categoryModel.find().exec();
        } catch (error) {
            console.log("TEST");
            console.log(error);
            
          throw new InternalServerErrorException(error);
        }

        return ["1","2"]
    }

    async create(createCategory: CreateCategoryDTO, userId: any): Promise<Category> {
      try {
        
        console.log(" ...");
        
        console.log(createCategory.slug);
        
          //Pasar estas dos lines a un archivo de utils
          createCategory.slug = createCategory.slug.trim();

          createCategory.slug = createCategory.slug.toLowerCase();

          //Con esto puedo anexar el userId al objeto 
          let cate: any = createCategory;
          
          cate.createdBy = userId;
          cate.updatedBy = userId;

        const newCategory = new this.categoryModel(cate);
  
        await newCategory.save();
  
        return newCategory;
      } catch (error) {
        
        console.log("error");
        console.log(error);
        if (error.status === 409)
          throw new ConflictException(
            'El código de categoria ya se encuentra registrado',
          );
  
        throw new InternalServerErrorException(error);
      }
    }

    async findOneById(id: ObjectId): Promise<Category> {
      try {
        const exists = await this.categoryModel.findOne({ _id: id }).exec();
  
        if (!exists) throw new NotFoundException();
  
        return exists;
      } catch (error) {
        if (error.status === 404)
          throw new NotFoundException(
            'El categoryo que intenta buscar no se encuentra registrado.',
          );
        throw new InternalServerErrorException(error);
      }
    }
  
    async updateOne(
      id: ObjectId,
      updateCategory: UpdateCategoryDTO,
      userId: any
    ): Promise<UpdateWriteOpResult> {
      try {
        const exists = await this.categoryModel.findById(id).count();
  
        if (exists === 0) throw new NotFoundException();

        //Con esto puedo anexar el userId al objeto 
        let cate: any = updateCategory;
          
        cate.updatedBy = userId;

      const newCategory = new this.categoryModel(cate);
  
        return await this.categoryModel.updateOne({ _id: id }, cate);
      } catch (error) {
        if (error.status === 404)
          throw new NotFoundException(
            'El categoryo que intenta actualizar no se encuentra registrado.',
          );
        throw new InternalServerErrorException(error);
      }
    }

    async deleteOne(
      id: ObjectId
    ): Promise<UpdateWriteOpResult> {
      try {
        const exists = await this.categoryModel.findById(id).count();
        
        console.log("exists: "+exists);
        
        if (exists === 0) throw new NotFoundException();
  
        return await this.categoryModel.updateOne({ _id: id }, {status: false } );
      } catch (error) {
        if (error.status === 404)
          throw new NotFoundException(
            'La categoria se ha eliminado correctamente.',
          );
        throw new InternalServerErrorException(error);
      }
    }
}
