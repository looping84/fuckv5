var cheerio = require("cheerio");
var request = require('request');
var async = require("async");
var colors = require('colors');
var _ = require("underscore");
var dict = require("./dict");




var arrUrl = [];

var fuck = {
    start: function() {
        this.get360Url();
        // console.log(this.getRandomName());
    },
    get360Url: function() {
        var me = this;
        console.log("正在获取病毒地址...".green);
        var date = new Date().getTime();
        request("http://webscan.360.cn/url", function(error, response, body) {
            var $ = cheerio.load(body);
            var count = $(".ld-list-g").find("a").length;
            $(".ld-list-g").find("a").each(function() {
                var name = $(this).attr("class"),
                    url = $(this).text();

                arrUrl.push(url)
                if (arrUrl.length == count) {
                    var t = "总共获取" + arrUrl.length + "条";
                    console.log(t.green, "耗时", (new Date().getTime() - date) / 1000, "秒");
                    me.submitData(arrUrl);
                }
            })
        })
    },
    submitData: function(arrUrl) {
        var random = Math.ceil(Math.random() * 100);
        var me = this;
        var count = 0;
        var task = _.map(arrUrl, function(item) {
            var postData = {};
            postData.mid = me.getRandomCate();
            postData.name = me.getRandomCharacter().slice(0, 5) + random++;
            postData.url = item + random++;
            postData.url = item;
            postData.intro = me.getRandomCharacter().slice(0, 10) + random++;

            return function(callback) {
                request.post({
                        url: "http://htmlbus.com/index.php/Home/Index/addurl/",
                        form: postData
                    },
                    function(error, response, body) {
                        console.log("提交的数据", postData);
                        try {
                            var json = JSON.parse(body);
                            console.log(json.status, json.info);
                            console.log(json);
                            if (json.status == 1) {
                                ++count;
                            }
                        } catch (e) {
                            // console.log(body);
                            if (/添加成功/.test(body)) {
                                ++count;
                            }
                        }

                        console.log("已经提交".green, count, "条");
                        callback();
                    });
            }
        })

        console.log("开始提交".green);
        async.parallelLimit(task.slice(2000), 5, function(err, results) {

        });

    },
    getRandomCharacter: function() {
        var len = dict.length,
            row = Math.floor(Math.random() * len),
            rowLen = dict[row].length,
            characterNum = rowLen;

        return dict[row].slice(Math.floor(Math.random() * rowLen))
    },
    getRandomCate: function() {
        var cate = [73, 74, 76, 78, 89];
        return cate[Math.floor(Math.random() * cate.length)];
    }
}

fuck.start();