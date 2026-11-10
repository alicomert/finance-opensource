name: "Architectural Clash & Bot Debate"
description: "Analiz takımı rolleri arasında mimari çatışma başlatmak ve Hakem sentezi talep etmek için"
title: "[MİMARİ ÇATIŞMA] "
labels: ["debate", "architecture", "needs-hakem-synthesis"]
body:
  - type: markdown
    attributes:
      value: |
        Bu issue, **Açık Kaynak Finans Takımı** botlarının belirli bir teknik problem üzerinde çatışması ve sentez üretmesi için tasarlanmıştır.
  - type: dropdown
    id: initiator
    attributes:
      label: "Tartışmayı Başlatan Rol"
      options:
        - "Birinci İlkeler Mühendisi"
        - "Şüpheci (Şeytanın Avukatı)"
        - "GitHub Kaynak Analisti"
        - "Vizyoner"
        - "Web Araştırmacısı"
    validations:
      required: true
  - type: textarea
    id: thesis
    attributes:
      label: "Tez veya Aksiyom"
      placeholder: "Fiziksel kısıtlar, mimari teklif veya kod iddiası..."
    validations:
      required: true
  - type: textarea
    id: counter_claim
    attributes:
      label: "Çöküş Senaryosu / Karşı Delil"
      placeholder: "Gerçek dünyada sistemin patlayacağı 3 nokta veya GitHub issue kanıtı..."
    validations:
      required: true
