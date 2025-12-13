import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Auto } from '../../app/interfaces/auto';
import { CurrencyPipe, NgClass, NgStyle, NgIf, NgFor } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-search-bar',
  imports: [CurrencyPipe, NgIf, NgFor, NgClass, NgStyle, FormsModule],
  templateUrl: './search-bar.html',
  styleUrl: './search-bar.css',
})
export class SearchBar {
  @Input() autos: Auto[] = [];

  @Output() onSelectAuto = new EventEmitter<Auto>();

  selectedAutos: Auto[] = [];
  favorites: Set<number> = new Set();

  // Filtres
  brandFilter: string = '';
  minPrice: number = 0;
  maxPrice: number = 1000;
  minPower: number = 0;
  maxPower: number = 20;
  onlyAvailable: boolean = false;
  sortBy: string = 'brand'; // 'brand', 'price-asc', 'price-desc', 'power-asc', 'power-desc'

  selectAutoList(brand: string = '') {
    this.brandFilter = brand;
    this.applyFiltersAndSort();
  }

  applyFiltersAndSort() {
    let filtered = this.autos.filter((x) =>
      x.brand.toLowerCase().startsWith(this.brandFilter.toLowerCase()) &&
      x.price >= this.minPrice &&
      x.price <= this.maxPrice &&
      x.power >= this.minPower &&
      x.power <= this.maxPower &&
      (!this.onlyAvailable || x.availability > 0)
    );

    // Tri
    switch (this.sortBy) {
      case 'price-asc':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'power-asc':
        filtered.sort((a, b) => a.power - b.power);
        break;
      case 'power-desc':
        filtered.sort((a, b) => b.power - a.power);
        break;
      case 'brand':
      default:
        filtered.sort((a, b) => a.brand.localeCompare(b.brand));
    }

    this.selectedAutos = filtered;
  }

  showDetails(auto: Auto) {
    this.onSelectAuto.emit(auto);
  }

  toggleFavorite(auto: Auto) {
    if (this.favorites.has(auto.id)) {
      this.favorites.delete(auto.id);
    } else {
      this.favorites.add(auto.id);
    }
  }

  isFavorite(auto: Auto): boolean {
    return this.favorites.has(auto.id);
  }

  autoTitleStyle(auto: Auto) {
    if (auto.power >= 10) return { color: 'red' };
    else return { color: 'black' };
  }

  resetFilters() {
    this.brandFilter = '';
    this.minPrice = 0;
    this.maxPrice = 1000;
    this.minPower = 0;
    this.maxPower = 20;
    this.onlyAvailable = false;
    this.sortBy = 'brand';
    this.selectedAutos = [];
  }

  getMaxPrice(): number {
    return this.autos.length > 0 ? Math.max(...this.autos.map((a) => a.price)) : 1000;
  }

  getMaxPower(): number {
    return this.autos.length > 0 ? Math.max(...this.autos.map((a) => a.power)) : 20;
  }
}
