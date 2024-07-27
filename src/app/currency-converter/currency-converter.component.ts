import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ExchangeRateService } from '../services/exchange-rate.service';
import { ExchangeRates } from './exchange-rates.model';

@Component({
  selector: 'app-currency-converter',
  templateUrl: './currency-converter.component.html',
  styleUrls: ['./currency-converter.component.scss'],
})
export class CurrencyConverterComponent implements OnInit {
  currencies: string[] = [];
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
    this.currencies = this.exchangeRateService.getCurrencies();
    this.getExchangeRates();
    this.onChanges();
  }

  getExchangeRates(): void {
    this.exchangeRateService.getRates().subscribe(
      (data) => {
        this.exchangeRates = data.rates;
        this.updateToAmount();
      },
      (error) => {
        this.apiError =
          'Failed to fetch exchange rates. Please try again later.';
      }
    );
  }

  onChanges(): void {
    this.form.get('fromAmount')?.valueChanges.subscribe(() => {
      this.updateToAmount();
    });
    this.form.get('fromCurrency')?.valueChanges.subscribe(() => {
      this.updateToAmount();
    });
    this.form.get('toAmount')?.valueChanges.subscribe(() => {
      this.updateFromAmount();
    });
    this.form.get('toCurrency')?.valueChanges.subscribe(() => {
      this.updateFromAmount();
    });
  }

  updateToAmount(): void {
    const fromAmount = this.form.get('fromAmount')?.value;
    const fromCurrency = this.form.get('fromCurrency')?.value;
    const toCurrency = this.form.get('toCurrency')?.value;
    const toAmount = this.exchangeRateService.calculateExchangeRate(
      fromAmount,
      fromCurrency,
      toCurrency,
      this.exchangeRates
    );
    this.form.patchValue({ toAmount }, { emitEvent: false });
  }

  updateFromAmount(): void {
    const toAmount = this.form.get('toAmount')?.value;
    const toCurrency = this.form.get('toCurrency')?.value;
    const fromCurrency = this.form.get('fromCurrency')?.value;
    const fromAmount = this.exchangeRateService.calculateExchangeRate(
      toAmount,
      toCurrency,
      fromCurrency,
      this.exchangeRates
    );
    this.form.patchValue({ fromAmount }, { emitEvent: false });
  }
}
