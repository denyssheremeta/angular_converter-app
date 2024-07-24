import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-currency-converter',
  templateUrl: './currency-converter.component.html',
  styleUrls: ['./currency-converter.component.scss'],
})
export class CurrencyConverterComponent implements OnInit {
  currencies: string[] = ['UAH', 'USD', 'EUR', 'PLN', 'CZK', 'ILS'];
  fromCurrency: string = 'USD';
  toCurrency: string = 'UAH';
  fromAmount: number = 1;
  toAmount: number = 1;
  exchangeRates: any = {};
  apiError: string = '';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.getExchangeRates();
  }

  getExchangeRates(): void {
    this.http
      .get<any>('https://api.exchangerate-api.com/v4/latest/UAH')
      .subscribe(
        (data) => {
          this.exchangeRates = data.rates;
          this.convertFromTo();
        },
        (error) => {
          this.apiError =
            'Failed to fetch exchange rates. Please try again later.';
        }
      );
  }

  convertFromTo(): void {
    if (this.fromCurrency === this.toCurrency) {
      this.toAmount = this.fromAmount;
    } else {
      const rate =
        this.exchangeRates[this.toCurrency] /
        this.exchangeRates[this.fromCurrency];
      this.toAmount = +(this.fromAmount * rate).toFixed(2);
    }
  }

  convertToFrom(): void {
    if (this.toCurrency === this.fromCurrency) {
      this.fromAmount = this.toAmount;
    } else {
      const rate =
        this.exchangeRates[this.fromCurrency] /
        this.exchangeRates[this.toCurrency];
      this.fromAmount = +(this.toAmount * rate).toFixed(2);
    }
  }

  onFromAmountChange(): void {
    this.convertFromTo();
  }

  onToAmountChange(): void {
    this.convertToFrom();
  }

  onFromCurrencyChange(): void {
    this.convertFromTo();
  }

  onToCurrencyChange(): void {
    this.convertToFrom();
  }
}
