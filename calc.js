(function(window, document)
{
    window.tildaCalculator = (function()
    {
        var app = {
            inputContainer: '.input-container',
            resultContainer: '.result-container',
            link: '.nav-link',
            rootTpl: 'root-tpl',
            kvmTpl: 'vmware-kvm-tpl',
            mapOfServices: {
                vmware: [
                    'IS-VHDD-SAS-GB-D-CS-FACT-ESX',
                    'IS-VHDD-SATA-GB-D-CS-FACT-ESX',
                    'IS-VHDD-SSD-GB-D-CS-FACT-ESX',
                    'IS-VCPU-SL6-PC-D-CS-FACT-ESX',
                    'IS-VRAM-000-GB-D-CS-FACT-ESX',
                    'IS-IPV4-000-PC-D-CS-FACT-ESX'
                ],
                kvm: [
                    'IS-VHDD-SAS-GB-D-CS-FACT-KVM',
                    'IS-VHDD-SATA-GB-D-CS-FACT-KVM',
                    'IS-VHDD-SSD-GB-D-CS-FACT-KVM',
                    'IS-VCPU-SL6-PC-D-CS-FACT-KVM',
                    'IS-VRAM-000-GB-D-CS-FACT-KVM',
                ],
                lic: [
                    'IS-SLIC-002-PC-D-CS-FACT-ESX',
                    'IS-SLIC-007-PC-D-CS-FACT-ESX',
                    'IS-SLIC-001-PC-D-CS-FACT-ESX',
                    'IS-SLIC-000-PC-D-CS-FACT-ESX',
                ],
                storage: [
                    'Next Cloud',
                    'S3',
                ],
                office: [
                    'Exchange',
                    'Zextras',
                ],
                messages: ['Express'],
            },
            result: {

            },
            tabs: {

            }
        };

        app.loadJson = function() {
            app.jsonData = JSON.plans[0].items;
        };

        app.renderInputContainer = function ($tab) {
            if ($.inArray($tab, ["vmware", "kvm", "lic"]) !== -1) {
                app.renderInputCommon($tab);
            }
        };

        app.renderResultContainer = function () {

        };

        app.renderInputCommon = function ($tab) {
            var itemsForRender = [];

            app.mapOfServices[$tab].forEach(function (index) {
                console.log(app.extractFromJson(index));
                itemsForRender.push(app.extractFromJson(index));
            });

            var tpl = _.template(document.getElementById(app.kvmTpl).innerHTML);

            $(app.inputContainer).html(tpl({
                items: itemsForRender
            }));

            console.log(itemsForRender);
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

            app.renderInputContainer('vmware');
            app.renderResultContainer();
            app.bindEvents();
        };

        app.bindEvents = function () {
            $(app.link).on('click', function () {
                $(app.link).removeClass('active');
                $(this).addClass('active');
            });
        };

        return app;
    })();

})(window, window.document);

var JSON = {
    "plans": [
        {
            "name": "Тариф СбКлауд для физ.лиц",
            "payment": "advance",
            "items": [
                {
                    "code": "IS-SLIC-002-PC-D-CS-FACT-ESX",
                    "invoice_name": "Аренда Windows Server 2016",
                    "name": "Windows Server 2016",
                    "cost": 12.7386,
                    "per": "day",
                    "unit": "lic",
                    "seg": "esx"
                },
                {
                    "code": "IS-SLIC-007-PC-D-CS-FACT-ESX",
                    "invoice_name": "Аренда SQL Server Standard",
                    "name": "SQL Server St.",
                    "cost": 415.8,
                    "per": "day",
                    "unit": "lic",
                    "seg": "esx"
                },
                {
                    "code": "IS-VHDD-SAS-GB-D-CS-FACT-ESX",
                    "invoice_name": "Блочное устройство класса SAS за ГБ",
                    "name": "SAS",
                    "cost": 0.3528,
                    "per": "day",
                    "unit": "GB",
                    "seg": "esx"
                },
                {
                    "code": "IS-VHDD-SAS-GB-D-CS-FACT-KVM",
                    "invoice_name": "Блочное устройство класса SAS за ГБ (KVM)",
                    "name": "SAS",
                    "cost": 0.175,
                    "per": "day",
                    "unit": "GB",
                    "seg": "kvm"
                },
                {
                    "code": "IS-VHDD-SATA-GB-D-CS-FACT-ESX",
                    "invoice_name": "Блочное устройство класса SATA за ГБ",
                    "name": "SATA",
                    "cost": 0.189,
                    "per": "day",
                    "unit": "GB",
                    "seg": "esx"
                },
                {
                    "code": "IS-VHDD-SATA-GB-D-CS-FACT-KVM",
                    "invoice_name": "Блочное устройство класса SATA за ГБ (KVM)",
                    "name": "SATA",
                    "cost": 0.119,
                    "per": "day",
                    "unit": "GB",
                    "seg": "kvm"
                },
                {
                    "code": "IS-VHDD-SSD-GB-D-CS-FACT-ESX",
                    "invoice_name": "Блочное устройство класса SSD за ГБ",
                    "name": "SSD",
                    "cost": 0.8316,
                    "per": "day",
                    "unit": "GB",
                    "seg": "esx"
                },
                {
                    "code": "IS-VHDD-SSD-GB-D-CS-FACT-KVM",
                    "invoice_name": "Блочное устройство класса SSD за ГБ (KVM)",
                    "name": "SSD",
                    "cost": 0.35,
                    "per": "day",
                    "unit": "GB",
                    "seg": "kvm"
                },
                {
                    "code": "IS-LOAD-000-PC-D-CS-FACT-ESX",
                    "invoice_name": "Балансировка нагрузки виртуальным балансировщиком",
                    "name": "Балансировщик",
                    "cost": 2.77,
                    "per": "day",
                    "unit": "pc",
                    "seg": "esx"
                },
                {
                    "code": "IS-VLAN-000-PC-D-CS-FACT-ESX",
                    "invoice_name": "VLAN",
                    "name": "VLAN",
                    "cost": 5.544,
                    "per": "day",
                    "unit": "pc",
                    "seg": ""
                },
                {
                    "code": "IS-IPV4-000-PC-D-CS-FACT-ESX",
                    "invoice_name": "Аренда внешнего IP-адреса",
                    "name": "IPv4",
                    "cost": 6.93,
                    "per": "day",
                    "unit": "pc",
                    "seg": ""
                },
                {
                    "code": "IS-0000-000-PC-D-CS-FACT-ESX",
                    "invoice_name": "Создание виртуального роутера",
                    "name": "Создание роутера",
                    "cost": 1.386,
                    "per": "day",
                    "unit": "pc",
                    "seg": ""
                },
                {
                    "code": "IS-VRAM-000-GB-D-CS-FACT-ESX",
                    "invoice_name": "ВМ произвольной конфигурации (vRAM) за ГБ",
                    "name": "RAM",
                    "cost": 9.03,
                    "per": "day",
                    "unit": "GB",
                    "seg": "esx"
                },
                {
                    "code": "IS-VRAM-000-GB-D-CS-FACT-KVM",
                    "invoice_name": "ВМ произвольной конфигурации (vRAM) за ГБ (KVM)",
                    "name": "RAM",
                    "cost": 4.9,
                    "per": "day",
                    "unit": "GB",
                    "seg": "kvm"
                },
                {
                    "code": "ST-OBST-000-GB-D-CS-FACT-ESX",
                    "invoice_name": "s3",
                    "name": "S3",
                    "cost": 0.882,
                    "per": "day",
                    "unit": "GB",
                    "seg": ""
                },
                {
                    "code": "IS-VCPU-SL6-PC-D-CS-FACT-ESX",
                    "invoice_name": "ВМ произвольной конфигурации (vCPU)",
                    "name": "CPU",
                    "cost": 17.085,
                    "per": "day",
                    "unit": "pc",
                    "seg": "esx"
                },
                {
                    "code": "IS-VCPU-SL6-PC-D-CS-FACT-KVM",
                    "invoice_name": "ВМ произвольной конфигурации (vCPU) (KVM)",
                    "name": "CPU",
                    "cost":5.95,
                    "per": "day",
                    "unit": "pc",
                    "seg": "kvm"
                },
                {
                    "code": "IS-SLIC-001-PC-D-CS-FACT-ESX",
                    "invoice_name": "Аренда Windows Server 2012",
                    "name": "Windows Server 2012",
                    "cost": 12.73,
                    "per": "day",
                    "unit": "lic",
                    "seg": "esx"
                },
                {
                    "code": "IS-VPNC-000-PC-D-CS-FACT-ESX",
                    "invoice_name": "Обработка VPN-соединения ",
                    "name": "VPN",
                    "cost": 2.77,
                    "per": "day",
                    "unit": "pc",
                    "seg": "esx"
                },
                {
                    "code": "IS-SLIC-000-PC-D-CS-FACT-ESX",
                    "invoice_name": "Аренда Windows Server 2008 R2",
                    "name": "Windows Server 2008 R2",
                    "cost": 12.7386,
                    "per": "day",
                    "unit": "lic",
                    "seg": "esx"
                },
                {
                    "code": "SS-SBC-NXT-000-P-UR-PC-M-AS",
                    "invoice_name": "Next CLoud",
                    "name": "Next Cloud",
                    "tariff": "Basic",
                    "cost": 1800,
                    "per": "month",
                    "unit": "lic",
                    "seg": "",
                    "description": "С возможностью добавить пользователя. 390 руб. за доп. пользоавтеля"
                },
                {
                    "code": "SS-SBC-NXT-001-P-UR-PC-M-AS",
                    "invoice_name": "Next CLoud",
                    "name": "Next Cloud",
                    "tariff": "Professional",
                    "cost": 10000,
                    "per": "month",
                    "unit": "lic",
                    "seg": "",
                    "description": "С возможностью добавить пользователей.1000 руб. за доп. пользователя"
                },
                {
                    "code": "SS-SBC-EXCH-000-P-UR-PC-M-AS",
                    "invoice_name": "Exchange",
                    "name": "Exchange",
                    "tariff": "Экономный",
                    "cost": 80.57,
                    "per": "month",
                    "unit": "lic",
                    "seg": "",
                    "description": "Имеет лицензию Outlook \n Хранение удаленных элементов 7 дней \n Квота на отправку писем 2000 \n Квота на отправку и получение писем 2024 \n Максимальный размер ящика, мб 2048 \n Максимальный размер отправляемого сообщения, мб 20 \n Максимальный размер получаемого сообщения, мб 20 \n Стоимость за каждый дополнительный Гб, основной ящик 2.85 р"
                },
                {
                    "code": "SS-SBC-EXCH-001-P-UR-PC-M-AS",
                    "invoice_name": "Exchange",
                    "name": "Exchange",
                    "tariff": "Базовый",
                    "cost": 176.63,
                    "per": "month",
                    "unit": "lic",
                    "seg": "",
                    "description": "Хранение удаленных элементов 14 дней \n Квота на отправку писем 4050 \n Квота на отправку и получение писем 4070 \n Максимальный размер ящика, мб 4096 \n Максимальный размер отправляемого сообщения, мб 20 \n Максимальный размер получаемого сообщения, мб 20 \n Стоимость за каждый дополнительный Гб, основной ящик 2.85 р"
                },
                {
                    "code": "SS-SBC-EXCH-002-P-UR-PC-M-AS",
                    "invoice_name": "Exchange",
                    "name": "Exchange",
                    "tariff": "Базовый +",
                    "cost": 265.54,
                    "per": "month",
                    "unit": "lic",
                    "seg": "",
                    "description": "Имеет лицензию Outlook \n Хранение удаленных элементов 14 дней \n Квота на отправку писем 4050 \n Квота на отправку и получение писем 4070 \n Максимальный размер ящика, мб 4096 \n Максимальный размер отправляемого сообщения, мб 20 \n Максимальный размер получаемого сообщения, мб 20 \n Стоимость за каждый дополнительный Гб, основной ящик 2.85 р"
                },
                {
                    "code": "SS-SBC-EXCH-003-P-UR-PC-M-AS",
                    "invoice_name": "Exchange",
                    "name": "Exchange",
                    "tariff": "Корпоративный",
                    "cost": 305.73,
                    "per": "month",
                    "unit": "lic",
                    "seg": "",
                    "description": "Хранение удаленных элементов 30 дней \n Квота на отправку писем 10200 \n Квота на отправку и получение писем 10220 \n Максимальный размер ящика, мб 10240 \n Максимальный размер отправляемого сообщения, мб 50 \n Максимальный размер получаемого сообщения, мб 50 \n Стоимость за каждый дополнительный Гб, основной ящик 4.87 р \n Стоимость за каждый дополнительный Гб, архивный ящик 2.85 р"
                },
                {
                    "code": "SS-SBC-EXCH-004-P-UR-PC-M-AS",
                    "invoice_name": "Exchange",
                    "name": "Exchange",
                    "tariff": "Корпоративный +",
                    "cost": 401.78,
                    "per": "month",
                    "unit": "lic",
                    "seg": "",
                    "description": "Имеет лицензию Outlook \n Хранение удаленных элементов 30 дней \n Квота на отправку писем 10200 \n Квота на отправку и получение писем 10220 \n Максимальный размер ящика, мб 10240 \n Максимальный размер отправляемого сообщения, мб 50 \n Максимальный размер получаемого сообщения, мб 50 \n Стоимость за каждый дополнительный Гб, основной ящик 4.87 р \n Стоимость за каждый дополнительный Гб, архивный ящик 2.85 р"
                },
                {
                    "code": "SS-SBC-ZEXT-000-P-UR-PC-M-AS",
                    "invoice_name": "Zextras Suite",
                    "name": "Zextras",
                    "tariff": "Suite",
                    "cost": 300,
                    "per": "month",
                    "unit": "lic",
                    "seg": ""
                },
                {
                    "code": "SS-SBC-ZEXT-001-P-UR-PC-M-AS",
                    "invoice_name": "Zextras Team Pro",
                    "name": "Zextras",
                    "tariff": "Team Pro",
                    "cost": 350,
                    "per": "month",
                    "unit": "lic",
                    "seg": ""
                },
                {
                    "code": "SS-SBC-EXPR-010-P-UR-PC-M-AS",
                    "invoice_name": "Express на 10 пользователей",
                    "name": "Express",
                    "tariff": "10 пользователей",
                    "cost": 2500,
                    "per": "month",
                    "unit": "lic",
                    "seg": ""
                },
                {
                    "code": "SS-SBC-EXPR-015-P-UR-PC-M-AS",
                    "invoice_name": "Express на 15 пользователей",
                    "name": "Express",
                    "tariff": "15 пользователей",
                    "cost": 3750,
                    "per": "month",
                    "unit": "lic",
                    "seg": ""
                },
                {
                    "code": "SS-SBC-EXPR-025-P-UR-PC-M-AS",
                    "invoice_name": "Express на 25 пользователей",
                    "name": "Express",
                    "tariff": "25 пользователей",
                    "cost": 6250,
                    "per": "month",
                    "unit": "lic",
                    "seg": ""
                },
                {
                    "code": "SS-SBC-EXPR-035-P-UR-PC-M-AS",
                    "invoice_name": "Express на 35 пользователей",
                    "name": "Express",
                    "tariff": "35 пользователей",
                    "cost": 8750,
                    "per": "month",
                    "unit": "lic",
                    "seg": ""
                },
                {
                    "code": "SS-SBC-EXPR-050-P-UR-PC-M-AS",
                    "invoice_name": "Express на 50 пользователей",
                    "name": "Express",
                    "tariff": "50 пользователей",
                    "cost": 11250,
                    "per": "month",
                    "unit": "lic",
                    "seg": ""
                },
                {
                    "code": "SS-SBC-EXPR-080-P-UR-PC-M-AS",
                    "invoice_name": "Express на 80 пользователей",
                    "name": "Express",
                    "tariff": "80 пользователей",
                    "cost": 18000,
                    "per": "month",
                    "unit": "lic",
                    "seg": ""
                }
            ]
        }
    ]
};
