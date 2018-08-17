# 简介
wagger-ui-layer 是一个基于swagger的前端UI实现,是为了替换了默认的swagger-ui,让生成的文档更加友好和美观  swagger-ui-layer 要依赖swagger的注解功能，因为swagger-ui-layer 仅仅只是一个前端UI界面的实现，解析的数据来源于 /v2/api-docs


#更新
接口展示增加排序，默认使用升序，按字典排序

#如何使用
1、引入jar包
首先需要在你的 pom.xml 中引入swagger 和 swagger-ui-layer 最新版的jar包

swagger-ui-layer 最新版jar包地址：http://search.maven.org/#search%7Cga%7C1%7Ccom.github.ohcomeyes

<dependency>
  <groupId>com.github.ohcomeyes</groupId>
  <artifactId>swagger-ui-layer</artifactId>
  <version>${last-version}</version>
</dependency>
2、swagger使用
具体的注解用法可参阅互联网

3、查看结果
swagger-ui-layer 的默认访问地址是 http://${host}:${port}/api-docs.html

License
Apache License 2.0
