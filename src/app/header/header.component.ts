import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  usdToUah: number | undefined;
  eurToUah: number | undefined;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.getExchangeRates();
  }

  getExchangeRates(): void {
    this.http
      .get<any>('https://api.exchangerate-api.com/v4/latest/UAH')
      .subscribe((data) => {
        this.usdToUah = 1 / data.rates.USD;
        this.eurToUah = 1 / data.rates.EUR;
      });
  }
}
