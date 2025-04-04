import { Directive, HostListener, Input, Renderer2, AfterViewInit, ElementRef } from "@angular/core";

@Directive({
	selector: '[w-dropdown]'
})
export class DropdownDirective implements AfterViewInit {
	@Input('w-dropdown') id!: string;

	@Input() minWidth?: number;

	private dropdown!: HTMLElement | null;

	isVisible = false;

	constructor(private el: ElementRef, private renderer: Renderer2) {}

	ngAfterViewInit(): void {
		if (this.id) {
			this.dropdown = document.getElementById(this.id);
		} else {
			this.dropdown = this.el.nativeElement.querySelector('app-dropdown');
		}

		if (this.dropdown) {
			this.renderer.setStyle(this.dropdown, 'position', 'absolute');

			this.renderer.setStyle(this.dropdown, 'z-index', '1000');

			this.renderer.setStyle(this.dropdown, 'overflow', 'hidden');

			this.renderer.setStyle(this.dropdown, 'height', '100%');

			this.renderer.setStyle(this.dropdown, 'transition', 'height 0.2s');

			this.setDropdownPosition();
		}
	}

	private setDropdownPosition(): void {
		if (this.dropdown) {
			const rect = this.el.nativeElement.getBoundingClientRect();

			let dropdownWidth = this.dropdown.offsetWidth;

			const viewportWidth = window.innerWidth;

			if (this.minWidth) {
				dropdownWidth = Math.max(this.minWidth, dropdownWidth);

				this.renderer.setStyle(this.dropdown, 'min-width', `${this.minWidth}px`);
			}

			let leftPosition = rect.left + window.scrollX;

			if (leftPosition + dropdownWidth > viewportWidth) {
				leftPosition = viewportWidth - dropdownWidth;
			}

			this.renderer.setStyle(this.dropdown, 'top', `${rect.bottom + window.scrollY}px`);

			this.renderer.setStyle(this.dropdown, 'left', `${leftPosition}px`);
		}
	}

	@HostListener('mouseenter')
	onMouseEnter(): void {
		if (this.dropdown) {
			this.setDropdownPosition();

			this.renderer.setStyle(this.dropdown, 'height', '100%');
		}
	}

	@HostListener('mouseleave')
	onMouseLeave(): void {
		if (this.dropdown) {
			this.renderer.setStyle(this.dropdown, 'height', '0px');
		}
	}
}