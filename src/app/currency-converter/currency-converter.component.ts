import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ExchangeRateService } from '../exchange-rate.service';
import { ExchangeRates } from './exchange-rates.model';

@Component({
  selector: 'app-currency-converter',
  templateUrl: './currency-converter.component.html',
  styleUrls: ['./currency-converter.component.scss'],
})
export class CurrencyConverterComponent implements OnInit {
  currencies: string[] = ['UAH', 'USD', 'EUR', 'PLN', 'CZK', 'ILS'];
  exchangeRates: ExchangeRates = {};
  apiError: string = '';

  form: FormGroup;

  constructor(
    private exchangeRateService: ExchangeRateService,
    private fb: FormBuilder
  ) {
    this.form = this.fb.group({
      fromAmount: [1],
      fromCurrency: ['USD'],
      toAmount: [1],
      toCurrency: ['UAH'],
    });
  }

  ngOnInit(): void {
    this.getExchangeRates();
    this.onChanges();
  }

  getExchangeRates(): void {
    this.exchangeRateService.getRates().subscribe(
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

  onChanges(): void {
    this.form.get('fromAmount')?.valueChanges.subscribe(() => {
      this.convertFromTo();
    });
    this.form.get('fromCurrency')?.valueChanges.subscribe(() => {
      this.convertFromTo();
    });
    this.form.get('toAmount')?.valueChanges.subscribe(() => {
      this.convertToFrom();
    });
    this.form.get('toCurrency')?.valueChanges.subscribe(() => {
      this.convertToFrom();
    });
  }

  convertFromTo(): void {
    const fromAmount = this.form.get('fromAmount')?.value;
    const fromCurrency = this.form.get('fromCurrency')?.value;
    const toCurrency = this.form.get('toCurrency')?.value;

    if (fromCurrency === toCurrency) {
      this.form.patchValue({ toAmount: fromAmount }, { emitEvent: false });
    } else {
      const rate =
        this.exchangeRates[toCurrency] / this.exchangeRates[fromCurrency];
      this.form.patchValue(
        { toAmount: +(fromAmount * rate).toFixed(2) },
        { emitEvent: false }
      );
    }
  }

  convertToFrom(): void {
    const toAmount = this.form.get('toAmount')?.value;
    const toCurrency = this.form.get('toCurrency')?.value;
    const fromCurrency = this.form.get('fromCurrency')?.value;

    if (toCurrency === fromCurrency) {
      this.form.patchValue({ fromAmount: toAmount }, { emitEvent: false });
    } else {
      const rate =
        this.exchangeRates[fromCurrency] / this.exchangeRates[toCurrency];
      this.form.patchValue(
        { fromAmount: +(toAmount * rate).toFixed(2) },
        { emitEvent: false }
      );
    }
  }
}
