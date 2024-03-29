import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import _ from 'lodash';
import { Repository } from 'typeorm';
import { Article } from './article.entity';

@Injectable()
export class BoardService {
  constructor(
    @InjectRepository(Article) private articleRepository: Repository<Article>,
  ) {}

  async getArticles() {
    return await this.articleRepository.find({
      where: { deletedAt: null },
      select: ['author', 'title', 'createdAt'],
    });
  }

  async getArticleById(id: number) {
    return await this.articleRepository.findOne({
      where: { id, deletedAt: null },
      select: ['author', 'title', 'content', 'createdAt', 'updatedAt'],
    });
  }

  createArticle(title: string, content: string, password: number) {
    this.articleRepository.insert({
      // 일단, 편의를 위해 author는 잠시 test로 고정
      author: 'test',
      title,
      content,
      // 나중에 암호화된 비밀번호를 저장
      password: password.toString(),
    });
  }

  async updateArticle(
    id: number,
    title: string,
    content: string,
    password: number,
  ) {
    await this.checkPassword(id, password);
    this.articleRepository.update(id, { title, content });
  }

  async deleteArticle(id: number, password: number) {
    await this.checkPassword(id, password);
    this.articleRepository.softDelete(id); // soft delete를 시켜주는 것이 핵심!
  }

  private async checkPassword(id: number, password: number) {
    const article = await this.articleRepository.findOne({
      where: { id, deletedAt: null },
      select: ['password'],
    });
    if (_.isNil(article)) {
      throw new NotFoundException(`Article not found. id: ${id}`);
    }

    if (article.password !== password.toString()) {
      throw new UnauthorizedException(
        `Article password is not correct. id: ${id}`,
      );
    }
  }
}
