import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import axios, { AxiosInstance } from 'axios';
import { GitHubFileResponse } from './user.type';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UserService {
  private readonly githubApi: AxiosInstance;
  private readonly owner: string;
  private readonly repo: string;
  private readonly branch: string;
  private readonly path: string;

  constructor(private readonly configService: ConfigService) {
    this.owner = this.configService.getOrThrow('github.owner'); // e.g. your GitHub username or org
    this.repo = this.configService.getOrThrow('github.repo'); // repo name
    this.branch = this.configService.getOrThrow('github.branch'); // branch name, default 'main'
    this.path = 'users.json';

    const token: string = this.configService.getOrThrow('github.token');

    if (!token) {
      throw new Error('GitHub token not set in GITHUB_TOKEN env var');
    }

    this.githubApi = axios.create({
      baseURL: 'https://api.github.com',
      headers: {
        Authorization: `token ${token}`,
        Accept: 'application/vnd.github.v3+json',
      },
    });
  }

  // Get file content at path (returns decoded JSON or string)
  async getFileContent(): Promise<any> {
    try {
      const response = await this.githubApi.get<GitHubFileResponse>(
        `/repos/${this.owner}/${this.repo}/contents/${this.path}?ref=${this.branch}`,
      );

      const content = response.data?.content;

      const encoding = response.data.encoding;

      if (encoding !== 'base64') {
        throw new HttpException('Unsupported encoding', HttpStatus.BAD_REQUEST);
      }

      const decoded = Buffer.from(content, 'base64').toString('utf-8');

      try {
        return JSON.parse(decoded);
      } catch {
        return decoded; // return raw string if not JSON
      }
    } catch (error) {
      if (error.response?.status === 404) {
        throw new HttpException('File not found', HttpStatus.NOT_FOUND);
      }
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // Create or update a file with JSON content
  async createOrUpdateFile(content: any, message: string): Promise<any> {
    try {
      // First, check if file exists to get the SHA (required for update)
      let sha;
      try {
        const existing = await this.githubApi.get<GitHubFileResponse>(
          `/repos/${this.owner}/${this.repo}/contents/${this.path}?ref=${this.branch}`,
        );

        sha = existing.data.sha;
      } catch (e) {
        if (e.response?.status !== 404) {
          throw e;
        }
        // file does not exist, so no SHA needed for creation
      }

      const base64Content = Buffer.from(
        JSON.stringify(content, null, 2),
      ).toString('base64');

      const body = {
        message,
        content: base64Content,
        branch: this.branch,
        sha,
      };

      const response = await this.githubApi.put(
        `/repos/${this.owner}/${this.repo}/contents/${this.path}`,
        body,
      );

      return response.data;
    } catch (error) {
      console.log('🚀 ~ UserService ~ error:', error);
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // Delete a file
  async deleteFile(message: string): Promise<any> {
    try {
      // Get SHA of the file to delete
      const file = await this.githubApi.get(
        `/repos/${this.owner}/${this.repo}/contents/${this.path}?ref=${this.branch}`,
      );

      const sha = file.data.sha;

      const body = {
        message,
        sha,
        branch: this.branch,
      };

      const response = await this.githubApi.delete(
        `/repos/${this.owner}/${this.repo}/contents/${this.path}`,
        { data: body },
      );

      return response.data;
    } catch (error) {
      if (error.response?.status === 404) {
        throw new HttpException('File not found', HttpStatus.NOT_FOUND);
      }
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
