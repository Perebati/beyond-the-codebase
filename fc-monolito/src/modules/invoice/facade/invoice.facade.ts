import UseCaseInterface from "../../@shared/usecase/use-case.interface";
import InvoiceFacadeInterface from "./invoice.facade.interface";
import {
  FindInvoiceUseCaseInputDTO,
  FindInvoiceUseCaseOutputDTO,
} from "../usecase/find-invoice/find-invoice.dto";
import {
  GenerateInvoiceUseCaseInputDto,
  GenerateInvoiceUseCaseOutputDto,
} from "../usecase/generate-invoice/generate-invoice.dto";

export type UseCaseKey = 'find' | 'generate';

export default class InvoiceFacade implements InvoiceFacadeInterface {
  private _usecases: Map<UseCaseKey, UseCaseInterface>;

  constructor() {
    this._usecases = new Map();
  }

  registerUseCase(key: UseCaseKey, usecase: UseCaseInterface): void {
    this._usecases.set(key, usecase);
  }

  async generate(
    input: GenerateInvoiceUseCaseInputDto
  ): Promise<GenerateInvoiceUseCaseOutputDto> {
    const usecase = this._usecases.get('generate');
    if (!usecase) {
      throw new Error('Generate usecase not registered');
    }
    return await usecase.execute(input);
  }

  async find(
    input: FindInvoiceUseCaseInputDTO
  ): Promise<FindInvoiceUseCaseOutputDTO> {
    const usecase = this._usecases.get('find');
    if (!usecase) {
      throw new Error('Find usecase not registered');
    }
    return await usecase.execute(input);
  }
} 