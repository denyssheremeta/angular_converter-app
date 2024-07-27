import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ExchangeRateService {
  private apiUrl = 'https://api.exchangerate-api.com/v4/latest';

  constructor(private http: HttpClient) {}

  getRates(base: string = 'UAH'): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${base}`);
  }

  calculateExchangeRate(
    fromAmount: number,
    fromCurrency: string,
    toCurrency: string,
    exchangeRates: any
  ): number {
    if (fromCurrency === toCurrency) {
      return fromAmount;
    }
    const rate = exchangeRates[toCurrency] / exchangeRates[fromCurrency];
    return +(fromAmount * rate).toFixed(2);
  }

  getCurrencies(): string[] {
    return ['UAH', 'USD', 'EUR', 'PLN', 'CZK', 'ILS'];
  }
}
