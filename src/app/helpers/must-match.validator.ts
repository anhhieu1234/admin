import { FormGroup } from '@angular/forms';

//trình xác thực tùy chỉnh để kiểm tra xem hai trường có khớp không
export function MustMatch(controlName: string, matchingControlName: string) {
    return (formGroup: FormGroup) => {
        const control = formGroup.controls[controlName];
        const matchingControl = formGroup.controls[matchingControlName];

        if (matchingControl.errors && !matchingControl.errors.mustMatch) {
            //trả lại nếu trình xác thực khác đã tìm thấy lỗi trên MatchControl
            return;
        }

        // đặt lỗi khi đối sánhControl nếu không xác thực được
        if (control.value !== matchingControl.value) {
            matchingControl.setErrors({ mustMatch: true });
        } else {
            matchingControl.setErrors(null);
        }
    }
}