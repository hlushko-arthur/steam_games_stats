import { CommonModule } from "@angular/common";
import { Component, ElementRef, OnInit, QueryList, ViewChildren } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { SteamAuthService } from "src/app/services/auth.service";

@Component({
	templateUrl: './login.component.html',
	styleUrl: './login.component.scss',
	standalone: true,
	imports: [CommonModule, FormsModule]
})

export class LoginComponent implements OnInit {
	@ViewChildren('codeInput') codeInputs!: QueryList<ElementRef>;

	isPasswordVisible = false;

	qrCodeUrl = '';

	isQRCodeExpired = false;

	accountName = '';
	
	password = '';

	isCredentialsIncorrect = false;

	isDeviceConfirmationNeeded = false;

	isTooManyAttempts = true;

	isConfirmationCodeLoading = false;

	confirmationType: 'device' | 'code' = 'code';

	code: string[] = ['', '', '', '', ''];

	constructor(private _auth: SteamAuthService) { }

	ngOnInit(): void {
		this.startQRAuth();
	}

	changePasswordVisibility(): void {
		this.isPasswordVisible = !this.isPasswordVisible;
	}

	async startQRAuth(): Promise<void> {
		this.qrCodeUrl = await this._auth.startQRAuth();

		this.isQRCodeExpired = false;

		setTimeout(() => {
			this.isQRCodeExpired = true;
		}, 60000);
	}

	async login(): Promise<void> {
		const result = await this._auth.login(this.accountName, this.password);

		if (result.includes('InvalidPassword')) {
			this.isCredentialsIncorrect = true;
		} else if (result.includes('DeviceConfirmation')) {
			this.isDeviceConfirmationNeeded = true;
		} else if (result.includes('RateLimitExceeded')) {
			this.isTooManyAttempts = true;
		}
	}

	handleInput(event: Event, index: number): void {
		const target = event.target as HTMLInputElement;

		if (!target.value) {
			return;
		}

		if (target.value.length > 1) {
			target.value = target.value.slice(1, 2);
		}

		this.code[index] = target.value;

		if (index < this.code.length - 1) {
			this.codeInputs.toArray()[index + 1].nativeElement.focus();
		} else {
			this.codeInputs.toArray()[index].nativeElement.blur();
		}

		this._checkCode();
	}

	handleKeydown(event: KeyboardEvent, index: number): void {
		setTimeout(() => {
			if (event.key === 'Backspace') {
				if (index-1 < 0) {
					return;
				}

				const inputElement = this.codeInputs.toArray()[index-1].nativeElement;

				this.code[index] = '';

				inputElement.focus();

				this.code[index - 1] = '';
				
				inputElement.value = '';
			  }
		}, 0);
	}

	handleFocus(index: number): void {
		if (!this.code[index]) {
			for (const [_index, value] of this.code.entries()) {
				if (!value) {
					this.codeInputs.toArray()[_index].nativeElement.focus();

					break;
				}
			}
		}
	}

	focusInput(index: number): void {
		const inputElement = document.querySelectorAll('.code-input')[index] as HTMLInputElement;

		if (inputElement) {
			inputElement.focus();
		}
	}

	navigateToSteamSupport(): void {
		window.location.href = 'https://help.steampowered.com/en/wizard/HelpWithLoginInfo?lost=8&issueid=402';
	}

	private _checkCode(): void {
		const code = this.code.join('');

		if (code.length === 5) {
			this._auth.sendGuardCode(code);

			this.isConfirmationCodeLoading = true;
			
			setTimeout(() => {
				this.isConfirmationCodeLoading = false;
			}, 2000);
		}
	}
}