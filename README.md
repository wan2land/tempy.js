tempy.js
========

Current Version : 1.0.0

## Release Note
### 1.0.0
- 작동방식의 변경.
- 로직 사용가능.

### 0.4.0
- 성능 향상을 위해 ";" 제거됨.
- 하나의 괄호 안에 여러 문법 사용 불가능.
- 주석 사용 불가능.


### 0.3.0

- 루프문 문법의 변경

	```
	{{ -- before }}
	{{ @ items -> key : value }} {{ / }}

	{{ -- after }}
	{{ @items : key, value }}{{ / }}
	```

	브라우저에서 직접 사용할 때 **>** 문자가 **&amp;gt;**로 바뀌는 일이 자꾸 발생


### 0.2.0
- 기본 지정한 문법 모두 구현






## 프로젝트 소개

Tempy는 한마디로 얘기하면 템플릿 엔진입니다. 필요한 기능만 구현된 최소화된 템플릿 엔진이 없을까하고 찾다가 에잉 그냥 공부도 할겸 만들어보자, 하고 시작된 프로젝트입니다.

Tempy만의 특징이라고 한다면.. 딱히 없습니다. 다른 템플릿 엔진보다 문법이 간결합니다. 그리고 템플릿 엔진내부에서 프로그래밍 하듯 쉽게 작성할 수 있습니다. `{{ }}`안에서 쭉쭉 작성해나갈 수 있습니다.

## 사용법

웹에서는 물론 Node에서도 사용가능하도록 작성하였습니다. 예제를 참고하시면 됩니다. (example로 시작하는 파일들.)

`src/tempy.js`에는 tempy문법을 포함하고 있습니다. 어떤 프로세서로 돌아가는지 console.log로 출력하기 위해서 작성하였습니다. 물론 tempy문법 자체는 주석처리 되어서 자바스크립트로 사용할때는 해석되지 않습니다. :)

또한 `grunt`를 통해서 빌드할 수 있습니다.

### Node에서 사용하기



### AMD에서 사용하기


## Tempy 문법

###1. 기본 문법

Tempy 소스는 `{{ }}`로 묶여있습니다.

> example1.1. 기본문법 1

```
{{ = '안녕하세요' }}
{{ = '여러분' }}
```

위에서 `'안녕하세요'`내용을 지정된 변수로 고치기만 하면 바로 사용가능합니다.

> example1.2. 단순 변수 사용

```
{{ = foo }}
```

배열또는 객체 안에 있는 내용은 `.`을 통해 구분해서 사용할 수 있습니다. 주의하셔야 하는 것은 배열도 객체처럼 `.`을 통해 구분하여서 사용해야합니다.

> example1.3. 배열, 객체 변수 사용

```
{{ = bar.0 }}
{{ = bar.1 }}
{{ = quux.obj1 }}
{{ = quux.obj2 }}	
```

###2. 조건문

조건문의 경우 다음과 같이 사용할 수 있습니다.

> example2.1. 기본 조건문

```
{{ ? true }}Print1{{ :? true }}출력x{{ : }}출력x{{ / }}

{{ ? false }}출력x{{ :? true }}Print2{{ : }}출력x{{ / }}

{{ ? false }}출력x{{ :? false }}출력x{{ : }}Print3{{ / }}
```

마찬가지로 조건문 안에 조건문, 즉 내부 조건문도 사용이 가능합니다.

> example2.2. 내부 조건문

```
{{ ? true }}{{ ? false }}출력x{{ :? true }}Inner Condition{{ : }}출력x{{ / }}
{{ :? true }}
출력x
{{ : }}
출력x
{{ / }}
```

위에서 처럼 true, false를 사용하셔도 되고, true, false가 대입되어있는 변수를 사용하여도 됩니다. 그리고 다음 처럼 조건문을 직접 작성하셔도 사용가능합니다.

=== 비교구문, &&, || 등의 기존에 자바스크립트에서 사용가능한 연산자를 그대로 지원하고 있습니다. (자바스크립트를 사용해서 만들었으니까요 ^^;)

> example2.3. Condition 사용가능

```
{{ ? ((foo === "Foo String") || false ) && true }}Condition{{ : }}출력X{{ / }}
```

###3. 반복문

다음 예제는 반복문에 관한 예제입니다. 반복문은 이터레이터 형태로만 사용할 수 있습니다.

> example3.1. 한줄 반복문

```
{{ @ bar : item }}{{ = item }}
{{ / }}
```


그렇다면 이중 반복문도 사용가능할까요? 물론입니다.

> example3.2. 이중 반복문

```
{{ @ baz : items }}{{ @ items : item }}{{ = item }}
{{ / }}{{ / }}
```

조건문과 함께 사용해보도록 하겠습니다. 조건문 안에 반복문을 사용할 경우입니다.

> example3.3. 반복문과 조건문 동시 사용1

```
{{ ? true }}
	{{ @ bar : item }}[With Condition:{{=item}}]{{ / }}
{{ :? true }}
출력 x
{{ : }}
출력 x
{{ / }}
```

위와 반대인, 반복문 안에 조건문을 사용한 경우입니다.

> example3.4. 반복문과 조건문 동시 사용2

```
{{ @ qux : k, item }}
	{{ ? item }}
		{{=k}}[True]
	{{ : }}
		{{=k}}[False]
	{{ / }}
{{ / }}
```

그리고 모든 반복문은 key, value로 받을 수 있습니다.

> example3.5. key, value 조건문 사용

```
{{ @ items1 : key, value }}{{=key}}, {{=value}}
{{ / }}

{{ @ items2 : key, value }}{{=key}}, {{=value}}
{{ / }}
```

만약에 키값만 사용하고 싶으면 value를 생략할 수 있습니다.

> example3.6. 반복문에서 key값만 사용

```
{{ @ items1 : key , }}{{=key}}
{{ / }}

{{ @ items2 : key , }}{{=key}}
{{ / }}
```

Tempy  에서 사용할수 있는 모든 문법으로 만들어본 예제입니다.

> example3.7. 반복문, 조건문 그리고 논리 연산자.

```
{{ @ items1 : k , v }}
	{{ ? v === 'AA' }}this({{ = k }}) is AA
	{{ : }}this({{ = k }}) is not AA
	{{ / }}
{{ / }}
```
모든 예제에 예제 번호를 이는 test에서 실제로 내장중입니다. test/tempy.js 파일을 참고하여주시기 바랍니다.



### 자료형

#### Boolean
 - true / false

#### Number
 - 30, 20, -1, 30.154 이런식으로..

#### String (single quot으로 사용가능)
- 'hello World'

#### Null


```
{{
hello = 20
= hello
}}
```
#### Template Extension

HTML을 더 멋있게 사용할 수 있는 Template Extension.
Tempy는 Javascript 기반 템플릿 엔진으로서 불완전 돔은 지원하지 않습니다.


```
{{
-- template.tempy
}}
<!doctype html>
<html>
<head>
</head>
<body>
{{ $include child }}
</body>
</html>
```

```
{{
-- myinfo.tempy
$template "template.tempy"
}}
<div>myinfo.js</div>
```

$ tempy myinfo.tempy myinfo.html

```
<!doctype html>
<html>
<head>
</head>
<body>
<div>myinfo.js</div>
</body>
</html>
```


## 참고자료

- [mustache.js](https://github.com/janl/mustache.js)
- [doT.js](https://github.com/olado/doT)
