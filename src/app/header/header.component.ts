import { Component, OnInit } from '@angular/core';
import { ExchangeRateService } from '../services/exchange-rate.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  usdToUah: number | undefined;
  eurToUah: number | undefined;

  constructor(private exchangeRateService: ExchangeRateService) {}

  ngOnInit(): void {
    this.getExchangeRates();
  }

  getExchangeRates(): void {
    this.exchangeRateService.getRates().subscribe((data) => {
      this.usdToUah = 1 / data.rates.USD;
      this.eurToUah = 1 / data.rates.EUR;
    });
  }
}
