import { plainToInstance, Transform } from 'class-transformer';
import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  Matches,
  Max,
  Min,
  validateSync,
} from 'class-validator';

enum NodeEnv {
  Development = 'development',
  Production = 'production',
  Test = 'test',
}

const emptyToUndefined = ({ value }: { value: unknown }) => {
  return value === '' ? undefined : value;
};

class EnvVariables {
  @IsEnum(NodeEnv)
  NODE_ENV: NodeEnv;

  @Transform(emptyToUndefined)
  @IsOptional()
  @Transform(({ value }) => Number(value))
  @IsInt()
  @Min(1)
  @Max(65535)
  PORT?: number;

  @IsString()
  @IsNotEmpty()
  @Matches(/^postgresql:\/\//)
  DATABASE_URL: string;

  @IsString()
  @IsNotEmpty()
  JWT_ACCESS_SECRET: string;

  @IsString()
  @IsNotEmpty()
  JWT_ACCESS_EXPIRES_IN: string;

  @IsString()
  @IsNotEmpty()
  GISTORY_CLIENT_ID: string;

  @IsString()
  @IsNotEmpty()
  GISTORY_CLIENT_SECRET: string;

  @IsUrl({ require_tld: false })
  GISTORY_AUTHORIZE_URL: string;

  @IsUrl({ require_tld: false })
  GISTORY_TOKEN_URL: string;

  @IsUrl({ require_tld: false })
  GISTORY_USERINFO_URL: string;

  @IsUrl({ require_tld: false })
  GISTORY_REDIRECT_URI: string;

  @IsString()
  @IsNotEmpty()
  GISTORY_SCOPES: string;

  @IsString()
  @IsNotEmpty()
  GISTORY_CODE_CHALLENGE: string;
}

export function validateEnv(config: Record<string, unknown>) {
  const validatedConfig = plainToInstance(EnvVariables, config, {
    enableImplicitConversion: true,
  });
  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    throw new Error(errors.toString());
  }
  return validatedConfig;
}
