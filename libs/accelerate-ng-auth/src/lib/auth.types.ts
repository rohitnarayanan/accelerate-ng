// external imports
import { jwtDecode } from 'jwt-decode';
import { get, set } from 'lodash-es';

// internal imports
import { GenericType } from '@rn-accelerate-ng/core';

// type definitions
export interface LoginResponse extends GenericType {
  readonly access_token: string;
  readonly refresh_token: string;
}

export class JwtToken {
  private static _JWT_ATTRS: Record<string, string> = {
    token_type: 'type',
    jti: 'id',
    iss: 'issuer',
    sub: 'subject',
    aud: 'audience',
    exp: 'expiry',
    iat: 'issuedAt',
  };

  readonly token: string;
  readonly type!: string;
  readonly id!: string;
  readonly issuer!: string;
  readonly subject!: string;
  readonly audience!: string;
  readonly expiry!: number;
  readonly issuedAt!: string;

  constructor(token: string) {
    this.token = token;

    const payload = jwtDecode(token);
    Object.entries(payload).forEach((value: [string, unknown]) => {
      const mappedKey =
        value[0] in JwtToken._JWT_ATTRS
          ? JwtToken._JWT_ATTRS[value[0]]
          : value[0];
      set(this, mappedKey, value[1]);
    });

    this.audience = Array.isArray(this.audience)
      ? this.audience[0]
      : this.audience;
    this.expiry = Number(this.expiry) * 1000;
  }

  get isValid(): boolean {
    return this.expiry > Date.now();
  }

  getAttribute<T>(attr: string): T {
    return get(this, attr) as T;
  }

  setAttribute(attr: string, value: unknown): void {
    set(this, attr, value);
  }
}

export interface UserProfile {
  readonly id: number;
  readonly email: string;
  readonly first_name: string;
  readonly last_name: string;
  readonly name: string;
  readonly role: string;
  readonly avatar: string;
  readonly is_staff: boolean;
  readonly is_superuser: boolean;
  readonly groups: {
    id: number;
    name: string;
    permissions: string[];
  }[];
  readonly permissions: string[];
  readonly status: string;
  readonly created_by: string;
  readonly created_at: string;
  readonly updated_by: string;
  readonly updated_at: string;
}
