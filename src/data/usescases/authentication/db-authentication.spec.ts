import { DbAuthentication } from "./db-authentication";
import {
  HashComparer,
  AccountModel,
  AuthenticationModel,
  LoadAccountByEmailRepository,
  TokenGenerator,
  UpdateAccessTokenRepository,
} from "./db-authentication-protocols";

const makeFakeAccount = (): AccountModel => ({
  id: "any_id",
  name: "any_name",
  email: "any_email@mail.com",
  password: "hashed_password",
});

const makeLoadAccountByEmailRepository = (): LoadAccountByEmailRepository => {
  class LoadAccountByEmailRepositoryStub
    implements LoadAccountByEmailRepository
  {
    async load(email: string): Promise<AccountModel> {
      return new Promise((resolve) => resolve(makeFakeAccount()));
    }
  }
  return new LoadAccountByEmailRepositoryStub();
};

const makeHashComparer = (): HashComparer => {
  class HashComparerStub implements HashComparer {
    async compare(value: string, hash: string): Promise<boolean> {
      return new Promise((resolve) => resolve(true));
    }
  }
  return new HashComparerStub();
};

const makeTokenGenerator = (): TokenGenerator => {
  class TokenGeneratorStub implements TokenGenerator {
    async generate(id: string): Promise<string> {
      return new Promise((resolve) => resolve("any_token"));
    }
  }
  return new TokenGeneratorStub();
};

const makeUpdateAccessTokenRepository = (): UpdateAccessTokenRepository => {
  class UpdateAccessTokenRepositoryStub implements UpdateAccessTokenRepository {
    async update(id: string, token: string): Promise<void> {
      return new Promise((resolve) => resolve());
    }
  }
  return new UpdateAccessTokenRepositoryStub();
};

const makeFakeAuthenticaiton = (): AuthenticationModel => ({
  email: "any_email@mail.com",
  password: "any_password",
});

interface SutTypes {
  sut: DbAuthentication;
  loadAccountByEmailRepositoryStub: LoadAccountByEmailRepository;
  hashComparerStub: HashComparer;
  tokenGeneratorStub: TokenGenerator;
  updateAccessTokenRepositoryStub: UpdateAccessTokenRepository;
}

const makeSut = (): SutTypes => {
  const loadAccountByEmailRepositoryStub = makeLoadAccountByEmailRepository();
  const hashComparerStub = makeHashComparer();
  const tokenGeneratorStub = makeTokenGenerator();
  const updateAccessTokenRepositoryStub = makeUpdateAccessTokenRepository();
  const sut = new DbAuthentication(
    loadAccountByEmailRepositoryStub,
    hashComparerStub,
    tokenGeneratorStub,
    updateAccessTokenRepositoryStub
  );

  return {
    sut,
    loadAccountByEmailRepositoryStub,
    hashComparerStub,
    tokenGeneratorStub,
    updateAccessTokenRepositoryStub,
  };
};

describe("DbAuthentication UseCase", () => {
  test("Should call LoadAccountByEmailRepository with correct email", async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut();
    const loadSpy = jest.spyOn(loadAccountByEmailRepositoryStub, "load");
    await sut.auth(makeFakeAuthenticaiton());

    expect(loadSpy).toHaveBeenCalledWith("any_email@mail.com");
  });

  test("Should thorw if LoadAccountByEmailRepository throws", async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut();
    jest
      .spyOn(loadAccountByEmailRepositoryStub, "load")
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error()))
      );
    const promise = sut.auth(makeFakeAuthenticaiton());

    await expect(promise).rejects.toThrow();
  });

  test("Should return null if LoadAccountByEmailRepository returns null", async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut();
    jest
      .spyOn(loadAccountByEmailRepositoryStub, "load")
      .mockReturnValueOnce(null);

    const accessToken = await sut.auth(makeFakeAuthenticaiton());

    expect(accessToken).toBeNull();
  });

  test("Should call HashComparer with correct values", async () => {
    const { sut, hashComparerStub } = makeSut();
    const compareSpy = jest.spyOn(hashComparerStub, "compare");
    await sut.auth(makeFakeAuthenticaiton());

    expect(compareSpy).toHaveBeenCalledWith("any_password", "hashed_password");
  });

  test("Should thorw if HashComparer throws", async () => {
    const { sut, hashComparerStub } = makeSut();
    jest
      .spyOn(hashComparerStub, "compare")
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error()))
      );
    const promise = sut.auth(makeFakeAuthenticaiton());

    await expect(promise).rejects.toThrow();
  });

  test("Should return null if HashComparer returns false", async () => {
    const { sut, hashComparerStub } = makeSut();
    jest
      .spyOn(hashComparerStub, "compare")
      .mockReturnValueOnce(new Promise((resolve) => resolve(false)));

    const accessToken = await sut.auth(makeFakeAuthenticaiton());

    expect(accessToken).toBeNull();
  });

  test("Should call TokenGenerator with correct id", async () => {
    const { sut, tokenGeneratorStub } = makeSut();
    const generateStubSpy = jest.spyOn(tokenGeneratorStub, "generate");
    await sut.auth(makeFakeAuthenticaiton());

    expect(generateStubSpy).toHaveBeenCalledWith("any_id");
  });

  test("Should thorw if TokenGenerator throws", async () => {
    const { sut, tokenGeneratorStub } = makeSut();
    jest
      .spyOn(tokenGeneratorStub, "generate")
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error()))
      );
    const promise = sut.auth(makeFakeAuthenticaiton());

    await expect(promise).rejects.toThrow();
  });

  test("Should call TokenGenerator with correct id", async () => {
    const { sut, tokenGeneratorStub } = makeSut();

    const accesTokn = await sut.auth(makeFakeAuthenticaiton());

    expect(accesTokn).toBe("any_token");
  });

  test("Should call UpdateAcessTokenRepository with correct values", async () => {
    const { sut, updateAccessTokenRepositoryStub } = makeSut();

    const updateSpy = jest.spyOn(updateAccessTokenRepositoryStub, "update");

    await sut.auth(makeFakeAuthenticaiton());

    expect(updateSpy).toHaveBeenCalledWith("any_id", "any_token");
  });

  test("Should thorw if UpdateAcessTokenRepository throws", async () => {
    const { sut, updateAccessTokenRepositoryStub } = makeSut();
    jest
      .spyOn(updateAccessTokenRepositoryStub, "update")
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error()))
      );
    const promise = sut.auth(makeFakeAuthenticaiton());

    await expect(promise).rejects.toThrow();
  });
});
