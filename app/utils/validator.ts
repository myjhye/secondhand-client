import * as yup from "yup";


// '유효성 검사 결과' 타입 정의
type ValidationResult<T> = { 
    error?: string; // 유효성 검사 실패 시 오류 메시지
    values?: T // 유효성 검사 성공 시 검증된 값
};

// 1. Yup 스키마를 사용한 유효성 검사 (실제 실행되는 함수)
export const yupValidate = async <T extends object>(
    schema: yup.Schema, // 유효성 검사에 사용할 Yup 스키마
    value: T // 검증할 객체 값
): Promise<ValidationResult<T>> => {

    try {
        // 1-1. 스키마로 값 검증 시도
        const data = await schema.validate(value);
        return { 
            values: data 
        };
    }
    catch (error) {
        // 1-2. Yup 유효성 검사 오류인 경우
        if (error instanceof yup.ValidationError) {
            return { 
                error: error.message 
            };
        }
        // 1-3. 기타 예상치 못한 오류의 경우 
        else {
            return { 
                error: (error as any).message 
            };
        }
    }
};

// 이메일 주소 형식 검증 정규식
export const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
// 비밀번호 복잡도 검증 정규식 (알파벳, 숫자, 특수문자 포함 필수)
const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#\$%\^&\*])[a-zA-Z\d!@#\$%\^&\*]+$/;


// 2. Yup에 커스텀 이메일 검증 메서드 추가 (string 타입에 email 메서드를 추가하여 정의된 정규식으로 이메일 형식 검증)
yup.addMethod(yup.string, "email", function validateEmail(message) {
    return this.matches(emailRegex, {
        message,
        name: "email",
        excludeEmptyString: true,
    });
});

// 3. 이메일과 비밀번호에 대한 공통 유효성 검사 규칙 (로그인과 회원가입에서 재사용되는 유효성 검사 규칙)
const emailAndPasswordValidation = {
    email: yup.string()
              .email("Invalid email!")
              .required("Email is missing"),
    password: yup.string()
                 .required("Password is missing")
                 .min(8, "Password should be at least 8 chars long!")
                 .matches(passwordRegex, "Password is too simple."),
};


// 4. 회원가입을 위한 유효성 검사 스키마
export const newUserSchema = yup.object({
    name: yup.string().required("Name is missing"),
    ...emailAndPasswordValidation,
});

// 5. 로그인을 위한 유효성 검사 스키마
export const signInSchema = yup.object({
    ...emailAndPasswordValidation,
});