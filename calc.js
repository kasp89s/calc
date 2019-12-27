(function(window, document)
{
    window.tildaCalculator = (function()
    {
        var app = {
            inputContainer: '.input-container',
            resultContainer: '.result-container',
            decreaseButton: 'a.decrease',
            increaseButton: 'a.increase',
            cleanTabLink: '.clean-tab',
            link: '.nav-link',
            rootTpl: 'root-tpl',
            kvmTpl: 'vmware-kvm-tpl',
            resultTpl: 'result-tpl',
            activeTab: 'vmware',
            mapOfServices: {
                vmware: [
                    'IS-VCPU-SL6-PC-D-CS-FACT-ESX',
                    'IS-VRAM-000-GB-D-CS-FACT-ESX',
                    'IS-VHDD-SAS-GB-D-CS-FACT-ESX',
                    'IS-VHDD-SATA-GB-D-CS-FACT-ESX',
                    'IS-VHDD-SSD-GB-D-CS-FACT-ESX',
                    'IS-IPV4-000-PC-D-CS-FACT-ESX'
                ],
                kvm: [
                    'IS-VCPU-SL6-PC-D-CS-FACT-KVM',
                    'IS-VRAM-000-GB-D-CS-FACT-KVM',
                    'IS-VHDD-SAS-GB-D-CS-FACT-KVM',
                    'IS-VHDD-SATA-GB-D-CS-FACT-KVM',
                    'IS-VHDD-SSD-GB-D-CS-FACT-KVM'
                ],
                lic: [
                    'IS-SLIC-002-PC-D-CS-FACT-ESX',
                    'IS-SLIC-007-PC-D-CS-FACT-ESX',
                    'IS-SLIC-001-PC-D-CS-FACT-ESX',
                    'IS-SLIC-000-PC-D-CS-FACT-ESX'
                ],
                storage: [
                    'Next Cloud',
                    'S3'
                ],
                office: [
                    'Exchange',
                    'Zextras'
                ],
                messages: ['Express']
            },
            result: {
                vmware: {},
                kvm: {},
                lic: {},
                storage: {},
                office: {},
                messages: {}
            },
            tabs: {
                vmware: 'VMware',
                kvm: 'KVM',
                lic: 'Лицензии',
                storage: 'Хранилище',
                office: 'Офис',
                messages: 'Мессенджеры'
            }
        };

        app.loadJson = function() {
            app.jsonData = JSON.plans[0].items;
        };

        app.renderInputContainer = function ($tab) {
            if ($.inArray($tab, ["vmware", "kvm", "lic"]) !== -1) {
                app.renderInputCommon($tab);
            } else {
                app.renderInputCustom($tab);
            }
        };

        app.renderResultContainer = function () {
            var items = {},
                resultTotal = 0;
            for (var tab in app.result) {
                if (!$.isEmptyObject(app.result[tab])) {
                    items[tab] = {};
                    var total = 0;
                    for (var code in app.result[tab]) {
                        var product = app.extractFromJson(code);
                        items[tab][code] = {
                            name: product['name'],
                            count: app.result[tab][code],
                            unit: product['unit'],
                            tariff: product['tariff'],
                            amount: app.roundAmount(app.convertAmount(product['cost'], product['per'], 'month') * app.result[tab][code])
                        };

                        total+= parseFloat(items[tab][code].amount);
                        resultTotal+= parseFloat(items[tab][code].amount);
                    }
                    items[tab]['total'] = app.roundAmount(total);
                }
            }

            var tpl = _.template(document.getElementById(app.resultTpl).innerHTML);

            $(app.resultContainer).html(tpl({
                resultTotal: app.roundAmount(resultTotal),
                items: items
            }));
        };

        app.renderInputCustom = function ($tab) {
            var itemsForRender = {};
            var tpl = _.template(document.getElementById($tab + '-tpl').innerHTML);

            itemsForRender = app.prepareRenderItems($tab);

            $(app.inputContainer).html(tpl({
                tab: $tab,
                tabData: app.result[$tab],
                items: itemsForRender
            }));

            $('.selectpicker').selectpicker();
        };

        app.prepareRenderItems = function ($tab) {
            var result = {};
            app.mapOfServices[$tab].forEach(function (element) {
                result[element] = app.extractGroupFromJson(element);
            });

            return result;
        };

        app.extractGroupFromJson = function($key) {
            var result = [];
            app.jsonData.forEach(function (item) {
                if (item.name === $key) {
                    result.push(item);
                }
            });

            return result;
        };

        app.renderInputCommon = function ($tab) {
            var itemsForRender = [];
            app.mapOfServices[$tab].forEach(function (index) {
                itemsForRender.push(app.extractFromJson(index));
            });

            var tpl = _.template(document.getElementById(app.kvmTpl).innerHTML);

            $(app.inputContainer).html(tpl({
                tab: $tab,
                tabData: app.result[$tab],
                items: itemsForRender
            }));
        };

        app.extractFromJson = function($key) {
            var result = null;
            app.jsonData.some(function (item) {
                if (item.code === $key) {
                    result = item;
                    return item;
                }
            });

            return result;
        };

        app.init = function($root)
        {
            app.loadJson();

            document.querySelectorAll($root).forEach(function (parrent) {
                var tpl = _.template(document.getElementById(app.rootTpl).innerHTML);

                parrent.innerHTML = tpl();
            });

            app.renderInputContainer(app.activeTab);
            app.renderResultContainer();
            app.bindEvents($root);
        };

        app.switchTab = function ($tab) {
            app.renderInputContainer($tab);
            app.activeTab = $tab;
        };

        app.convertAmount = function ($amount, $inType, $outType) {
            // Переводим для начала в дни.
            var amountPerDay = 0,
                resultAmount = 0;
            switch ($inType) {
                case 'hour': amountPerDay = $amount * 24;
                    break;
                case 'day': amountPerDay = $amount;
                    break;
                case 'month': amountPerDay = ($amount * 12) / 365;
                    break;
                case 'year': amountPerDay = $amount / 365;
                    break;
                default: throw new Error('wrong input type ' + $inType);
            }

            switch ($outType) {
                case 'day': resultAmount = amountPerDay;
                    break;
                case 'month': resultAmount = amountPerDay * 365 / 12;
                    break;
                case 'year': resultAmount = amountPerDay * 365;
                    break;
                default: throw new Error('wrong output type ' + $outType);
            }

            return app.roundAmount(resultAmount);
        };

        app.roundAmount = function($amount) {
            return $amount.toFixed(2);
        };

        app.bindEvents = function ($root) {
            $(app.link).on('click', function () {
                if ($(this).hasClass('active')) {
                    return false;
                }

                $(app.link).removeClass('active');
                $(this).addClass('active');

                app.switchTab($(this).data('link'));
            });

            $($root).on('change', 'input', function () {
                var input = $(this),
                    min = parseInt(input.data('min')),
                    value = parseInt(input.val()) + 1;

                if (value < min)
                    value = min;

                input.val(value);

                app.result[input.data('tab')][input.data('code')] = value;

                $('#' + input.data('code') + '-total').text(app.roundAmount(parseFloat(input.data('cost')) * value));

                app.renderResultContainer();
            });
            
            $($root).on('click', app.increaseButton, function () {
                var input = $(this).closest('.main-calc').find('input'),
                    min = parseInt(input.data('min')),
                    value = parseInt(input.val()) + 1;

                if (value < min)
                    value = min;

                input.val(value);

                app.result[input.data('tab')][input.data('code')] = value;

                $('#' + input.data('code') + '-total').text(app.roundAmount(parseFloat(input.data('cost')) * value));

                app.renderResultContainer();
            });

            $($root).on('click', app.decreaseButton, function () {
                var input = $(this).closest('.main-calc').find('input'),
                    min = parseInt(input.data('min'));

                if (parseInt(input.val()) <= 0)
                    return false;

                var value = parseInt(input.val()) - 1;

                if (value < min)
                    value = 0;

                input.val(value);
                app.result[input.data('tab')][input.data('code')] = value;

                if (value === 0)
                    delete app.result[input.data('tab')][input.data('code')];

                $('#' + input.data('code') + '-total').text(app.roundAmount(parseFloat(input.data('cost')) * value));

                app.renderResultContainer();
            });

            $($root).on('click', app.cleanTabLink, function () {
                var tab = $(this).data('tab');
                app.result[tab] = {};

                if (tab === app.activeTab)
                    app.renderInputContainer(tab);

                app.renderResultContainer();
            });

            app.mapOfServices.messages.forEach(function (element) {
                $($root).on('change', '.' + element + '-selector', function () {
                    if ($(this).val()) {
                        app[element] = $(this).val();

                        app.result.messages = {};
                        app.renderInputContainer('messages');
                        app.renderResultContainer();
                    }
                });
            });
        };

        return app;
    })();

})(window, window.document);

var JSON = {

    "plans": [

        {
            "name": "Тариф СбКлауд юридический",
            "payment": "credit",
            "items": [
                {
                    "code": "IS-SLIC-002-PC-D-CS-FACT-ESX",
                    "invoice_name": "Аренда Windows Server 2016",
                    "name": "Windows 2016",
                    "cost": 10.50,
                    "per": "day",
                    "unit": "шт",
                    "seg": "esx"
                },
                {
                    "code": "IS-VCPU-SL6-PC-D-CS-FACT-ESX",
                    "invoice_name": "ВМ произвольной конфигурации (vCPU)",
                    "name": "CPU",
                    "cost": 9.80,
                    "per": "day",
                    "unit": "шт",
                    "seg": "esx"
                },
                {
                    "code": "IS-VRAM-000-GB-D-CS-FACT-ESX",
                    "invoice_name": "ВМ произвольной конфигурации (vRAM) за ГБ",
                    "name": "RAM",
                    "cost": 7,
                    "per": "day",
                    "unit": "ГБ",
                    "seg": "esx"
                },
                {
                    "code": "IS-VCPU-SL6-PC-D-CS-FACT-KVM",
                    "invoice_name": "ВМ произвольной конфигурации (vCPU) (KVM)",
                    "name": "CPU",
                    "cost":5.95,
                    "per": "day",
                    "unit": "шт",
                    "seg": "kvm"
                },
                {
                    "code": "IS-VRAM-000-GB-D-CS-FACT-KVM",
                    "invoice_name": "ВМ произвольной конфигурации (vRAM) за ГБ (KVM)",
                    "name": "RAM",
                    "cost": 4.9,
                    "per": "day",
                    "unit": "ГБ",
                    "seg": "kvm"
                },
                {
                    "code": "IS-SLIC-007-PC-D-CS-FACT-ESX",
                    "invoice_name": "Аренда SQL Server Standard",
                    "name": "SQL Server St.",
                    "cost": 9000,
                    "per": "month",
                    "unit": "шт",
                    "seg": "esx"
                },
                {
                    "code": "IS-VHDD-SATA-GB-D-CS-FACT-ESX",
                    "invoice_name": "Блочное устройство класса SATA за ГБ",
                    "name": "Диск SATA",
                    "cost": 0.14,
                    "per": "day",
                    "unit": "ГБ",
                    "seg": "esx"
                },
                {
                    "code": "IS-VHDD-SAS-GB-D-CS-FACT-ESX",
                    "invoice_name": "Блочное устройство класса SAS за ГБ",
                    "name": "Диск SAS",
                    "cost": 0.23,
                    "per": "day",
                    "unit": "ГБ",
                    "seg": "esx"
                },
                {
                    "code": "IS-VHDD-SATA-GB-D-CS-FACT-KVM",
                    "invoice_name": "Блочное устройство класса SATA за ГБ (KVM)",
                    "name": "Диск SATA",
                    "cost": 0.11,
                    "per": "day",
                    "unit": "ГБ",
                    "seg": "kvm"
                },
                {
                    "code": "IS-VHDD-SAS-GB-D-CS-FACT-KVM",
                    "invoice_name": "Блочное устройство класса SAS за ГБ (KVM)",
                    "name": "Диск SAS",
                    "cost": 0.17,
                    "per": "day",
                    "unit": "ГБ",
                    "seg": "kvm"
                },
                {
                    "code": "IS-VHDD-SSD-GB-D-CS-FACT-ESX",
                    "invoice_name": "Блочное устройство класса SSD за ГБ",
                    "name": "Диск SSD",
                    "cost": 0.53,
                    "per": "day",
                    "unit": "ГБ",
                    "seg": "esx"
                },
                {
                    "code": "IS-VHDD-SSD-GB-D-CS-FACT-KVM",
                    "invoice_name": "Блочное устройство класса SSD за ГБ (KVM)",
                    "name": "Диск SSD",
                    "cost": 0.35,
                    "per": "day",
                    "unit": "ГБ",
                    "seg": "kvm"
                },
                {
                    "code": "IS-IPV4-000-PC-D-CS-FACT-ESX",
                    "invoice_name": "Аренда внешнего IP-адреса",
                    "name": "IPv4",
                    "cost": 5.25,
                    "per": "day",
                    "unit": "шт",
                    "seg": ""
                },
                {
                    "code": "ST-OBST-000-GB-D-CS-FACT-ESX",
                    "invoice_name": "s3",
                    "name": "S3",
                    "cost": 0.07,
                    "per": "day",
                    "unit": "ГБ",
                    "seg": ""
                },
                {
                    "code": "IS-SLIC-001-PC-D-CS-FACT-ESX",
                    "invoice_name": "Аренда Windows Server 2012",
                    "name": "Windows 2012",
                    "cost": 10.50,
                    "per": "day",
                    "unit": "шт",
                    "seg": "esx"
                },
                {
                    "code": "IS-SLIC-000-PC-D-CS-FACT-ESX",
                    "invoice_name": "Аренда Windows Server 2008 R2",
                    "name": "Windows 2008 R2",
                    "cost": 10.50,
                    "per": "day",
                    "unit": "шт",
                    "seg": "esx"
                },
                {
                    "code": "SS-SBC-NXT-000-P-UR-PC-M-AS",
                    "invoice_name": "Next CLoud",
                    "name": "Next Cloud",
                    "tariff": "Basic",
                    "cost": 1800,
                    "per": "month",
                    "unit": "шт",
                    "seg": "",
                    "description": "Описание тарифных планов"
                },
                {
                    "code": "SS-SBC-NXT-001-P-UR-PC-M-AS",
                    "invoice_name": "Next CLoud",
                    "name": "Next Cloud",
                    "tariff": "Professional",
                    "cost": 10000,
                    "per": "month",
                    "unit": "шт",
                    "seg": ""
                },
                {
                    "code": "SS-SBC-EXCH-000-P-UR-PC-M-AS",
                    "invoice_name": "Exchange",
                    "name": "Exchange",
                    "tariff": "Экономный",
                    "cost": 80.57,
                    "per": "month",
                    "unit": "шт",
                    "seg": "",
                    "description": "Описание тарифных планов"
                },
                {
                    "code": "SS-SBC-EXCH-001-P-UR-PC-M-AS",
                    "invoice_name": "Exchange",
                    "name": "Exchange",
                    "tariff": "Базовый",
                    "cost": 176.63,
                    "per": "month",
                    "unit": "шт",
                    "seg": ""
                },
                {
                    "code": "SS-SBC-EXCH-002-P-UR-PC-M-AS",
                    "invoice_name": "Exchange",
                    "name": "Exchange",
                    "tariff": "Базовый +",
                    "cost": 265.54,
                    "per": "month",
                    "unit": "шт",
                    "seg": ""
                },
                {
                    "code": "SS-SBC-EXCH-003-P-UR-PC-M-AS",
                    "invoice_name": "Exchange",
                    "name": "Exchange",
                    "tariff": "Корпоративный",
                    "cost": 305.73,
                    "per": "month",
                    "unit": "шт",
                    "seg": ""
                },
                {
                    "code": "SS-SBC-EXCH-004-P-UR-PC-M-AS",
                    "invoice_name": "Exchange",
                    "name": "Exchange",
                    "tariff": "Корпоративный +",
                    "cost": 401.78,
                    "per": "month",
                    "unit": "шт",
                    "seg": ""
                },
                {
                    "code": "SS-SBC-ZEXT-000-P-UR-PC-M-AS",
                    "invoice_name": "Zextras Suite",
                    "name": "Zextras",
                    "tariff": "Suite",
                    "cost": 300,
                    "per": "month",
                    "unit": "польз",
                    "min": 5,
                    "seg": ""
                },
                {
                    "code": "SS-SBC-ZEXT-001-P-UR-шт-M-AS",
                    "invoice_name": "Zextras Team Pro",
                    "name": "Zextras",
                    "tariff": "Team Pro",
                    "cost": 350,
                    "per": "month",
                    "unit": "польз",
                    "min": 10,
                    "seg": ""
                },
                {
                    "code": "SS-SBC-EXPR-010-P-UR-PC-M-AS",
                    "invoice_name": "Express на 10 пользователей",
                    "name": "Express",
                    "tariff": "10 пользователей",
                    "cost": 2500,
                    "per": "month",
                    "unit": "шт",
                    "seg": ""
                },
                {
                    "code": "SS-SBC-EXPR-015-P-UR-PC-M-AS",
                    "invoice_name": "Express на 15 пользователей",
                    "name": "Express",
                    "tariff": "15 пользователей",
                    "cost": 3750,
                    "per": "month",
                    "unit": "шт",
                    "seg": ""
                },
                {
                    "code": "SS-SBC-EXPR-025-P-UR-PC-M-AS",
                    "invoice_name": "Express на 25 пользователей",
                    "name": "Express",
                    "tariff": "25 пользователей",
                    "cost": 6250,
                    "per": "month",
                    "unit": "шт",
                    "seg": ""
                },
                {
                    "code": "SS-SBC-EXPR-035-P-UR-PC-M-AS",
                    "invoice_name": "Express на 35 пользователей",
                    "name": "Express",
                    "tariff": "35 пользователей",
                    "cost": 8750,
                    "per": "month",
                    "unit": "шт",
                    "seg": ""
                },
                {
                    "code": "SS-SBC-EXPR-050-P-UR-PC-M-AS",
                    "invoice_name": "Express на 50 пользователей",
                    "name": "Express",
                    "tariff": "50 пользователей",
                    "cost": 11250,
                    "per": "month",
                    "unit": "шт",
                    "seg": ""
                },
                {
                    "code": "SS-SBC-EXPR-080-P-UR-PC-M-AS",
                    "invoice_name": "Express на 80 пользователей",
                    "name": "Express",
                    "tariff": "80 пользователей",
                    "cost": 18000,
                    "per": "month",
                    "unit": "шт",
                    "seg": ""
                }
            ]
        }
    ]
};
