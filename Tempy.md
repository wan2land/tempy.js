## Tempy 문법


### Simple Variable

간단히 변수를 대입하고자 할때. `$tpl->assign('variable1', $var1);`를 통해서 입력가능합니다.

```
{{=variable1}}

```

### Array Variable (key array)

변수 대입은 Array, Object 모두 사용가능합니다.

```
// $variable2['key1']
// $variable2['key2']

// $variable2->key1
// $variable2->key2

{{=variable2.key1}}
{{=variable2.key2}}


// $variable3[0]
// $variable3[1]

{{=variable3.0}}
{{=variable3.1}}
```

### Operator 

아직은 지원하지 않습니다.

### if condition

다음과 같은 형태로 사용가능합니다.

```
{{?true}}

{{:false}}

{{/}}
```

### Loop

루프문의 경우 이터레이터 형태로 지원하며 현재는 List형태의 배열만 지원합니다. (이후 Map형태의 배열도 추가하도록 하겠습니다.)

```
// $items[] = 1;
// $items[] = 2;
// $items[] = 3;

{{@items->item}}
this is {{item}}
{{/}}

// export
// this is 1 this is 2 this is 3
```



##Tempy Extended

### Functions

#### include( file_path )

내부적으로 다른 템플릿을 또 불러오고자 할때 사용하면 됩니다.
```
// 직접 파일명을 입력해도 되고,
{{ include("header.html") }}

// 변수로 대입해서 사용해도 됩니다.
{{ include( variable ) }}
```


## Example

이런식으로 사용하시면 됩니다.

```lang-php
if ( !file_exists(__DIR__.'/temp/home.html') ) {
	// 보통 여기에 수많은 작업들이 들어갈 수 있습니다.
	// Template Engine을 사용하여 텍스트를 생성합니다.
	$text = TemplateEngine::open(__DIR__.'/tpl/home.html')->render();
	file_put_contents(__DIR__.'/temp/home.html', $text);
}


include __DIR__.'/temp/home.html';

```

이 코드는 처음한번은 `temp/home.html`를 생성하느라 오래걸리더라도, 그 이후에는 매번 같은 코드를 수행하지 않게 됩니다. :)



## To-do List

- 사용자 정의 함수 추가
- 오퍼레이터 + - * /
- {{ if item == "item" : include("item.html"); endif }} 연결된 연산처리
