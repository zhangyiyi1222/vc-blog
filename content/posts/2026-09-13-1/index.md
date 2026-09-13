---
title: "1"
date: 2026-09-13T12:00:00+08:00
categories:
  - 亲
draft: false
---

你现在不是在给我做一个普通的 AI SaaS 网站。

你要作为：
产品经理 + 高级 UI/UX 设计师 + 前端工程师 + 电商转化设计师，
在我现有项目基础上，重新设计并实现一个“AI 成果模板 / Prompt Pack 商店”。

先完整检查现有项目：
- 当前技术栈
- 路由结构
- 已有组件
- 已有页面
- 已有数据库/API
- 已有支付或用户系统
- 已经能工作的功能

原则：
不要为了重构而重构。
优先复用已有项目。
不要随便删除已有功能。
如果已有技术栈能够完成，不要另起炉灶。
先审计，再实施。

--------------------------------------------------
一、产品定位
--------------------------------------------------

这个网站不是“提示词搜索网站”。

也不是：
“10000 个 Prompt 随便搜”的 Prompt Library。

我们的定位是：

“高质量 AI 成果模板商店”

用户看到的核心不是 Prompt 本身，
而是：

“我用了这个模板，可以得到什么结果？”

所以网站销售逻辑必须围绕：

结果展示
→ 使用场景
→ 示例
→ 免费试看
→ Prompt / 模板内容
→ 购买完整 Pack

核心商品可能包括：

AI 电商商品图模板包
AI 短视频封面模板包
AI 人物写真模板包
AI 发型分析模板包
AI 色彩分析模板包
AI 品牌视觉模板包
AI 短剧角色设定模板包
AI 三视图模板包
AI 内容创作 Prompt Pack
以后还可能增加 Workflow / Skill / Agent / 素材包

所以网站架构从一开始要支持：
Prompt Pack
Template Pack
Workflow
Skill
Asset Pack

但第一版视觉重点仍然放在 Prompt / Template Pack。

--------------------------------------------------
二、整体视觉方向
--------------------------------------------------

我要的不是廉价 AI 网站。

不要：
紫蓝渐变满屏
发光机器人
3D AI 大脑
大量霓虹
复杂 dashboard
到处玻璃拟态
典型 SaaS landing page
满屏小卡片
花里胡哨 icon

我要：

高级
现代
编辑感
极简
强视觉
大字号
大量留白
优秀的图片展示
精品数字商品商店感

整体参考气质可以理解为：

现代设计工作室
+
高端数字产品商店
+
AI 创意作品展示平台
+
时尚杂志编辑页面

不是直接抄某一个网站，
但可以主动联网研究目前设计优秀的：
AI image / creative tool 网站
设计作品平台
高级数字商品商城
现代 editorial website

重点学习它们的：
信息层级
Hero 比例
字体尺度
图片布局
卡片比例
Hover
页面节奏
留白
商品详情页结构

不要复制别人的 Logo、文案、图片或品牌资产。

--------------------------------------------------
三、视觉系统
--------------------------------------------------

整体背景：
偏暖白 / 米白 / 极浅灰

主文字：
接近黑色

辅助文字：
中性灰

边框：
非常浅的灰

强调色：
只使用一种低饱和高级强调色，
不要彩虹式配色。

圆角：
适度。
不要每个元素都做成巨大圆角卡片。

阴影：
极弱甚至没有。
更多依靠：
空间
比例
边框
图片
字体层级
形成高级感。

字体：
英文优先使用高级现代 Sans Serif 风格。
中文使用干净现代黑体。
数字与价格排版要漂亮。

核心要求：

“大字体”。

Hero 主标题桌面端可以大胆做到：
72px–120px 视觉尺度。

但必须响应式，
手机端保持清晰而不是简单缩小。

大标题 + 大作品图
要成为这个网站最明显的视觉特征。

--------------------------------------------------
四、网站 Logo / Header
--------------------------------------------------

Header 极简。

左侧：
品牌 Logo / Wordmark

中间或右侧：
Explore
Packs
Free
Categories

右侧：
Search
My Library
Account

如果未登录：
Sign in

右上角不要塞一堆按钮。

Header：
桌面端保持轻盈。
可以 sticky。
滚动之后轻微背景模糊或实色，
但不要重玻璃效果。

--------------------------------------------------
五、首页 Home
--------------------------------------------------

首页不是传统 SaaS 首页。

首页第一屏必须强。

Hero：

一个非常大的主标题，例如：

Create better with AI.
Start from what already works.

或者：

Don't start from a blank prompt.

下面一句非常短的说明：

Curated AI templates built around real visual results.

然后：

Explore Packs
Try Free Templates

两个 CTA。

Hero 附近必须出现真实“成果图片”。

不要放抽象 AI 图形。

可以使用：
不对称 Editorial Grid
大型主图 + 小图
Masonry
横向作品轨道

让用户第一眼知道：
这里卖的是可以产生漂亮成果的 AI 模板。

--------------------------------------------------

Hero 下方：

Featured Results

直接展示 6–10 个非常漂亮的最终作品。

每张作品 Hover 后显示：

模板名称
类别
适用模型
View template

重点：
先看作品，
再知道 Prompt。

--------------------------------------------------

下一段：

Popular Packs

大尺寸商品卡片。

每个 Pack 卡片包含：

封面
Pack 名称
一句结果导向描述
模板数量
类别
价格
部分兼容模型 Logo
查看详情

例如：

AI Product Photography Pack

“Turn ordinary product shots into polished campaign visuals.”

30 Templates
For ChatGPT Image / Midjourney / Flux
¥19.9

不要用非常密集的小商品卡。

一屏 2–3 个精品商品即可。

--------------------------------------------------

下一段：

Before / After

这是首页非常重要的一块。

左：
原始输入

右：
使用模板后的效果

支持滑动对比或者并排对比。

例如：

普通自拍
→
高级发型分析图

普通商品白底图
→
高级商业广告图

普通人物
→
专业角色设定图

普通照片
→
编辑感人物海报

必须直接告诉用户：
买这个东西到底能干嘛。

--------------------------------------------------

下一段：

Free Templates

展示 5–10 个免费模板。

卡片直接允许：
Preview
Copy Prompt

免费内容承担获客作用。

不要强迫注册后才能看所有免费样品。
第一版尽量降低摩擦。

--------------------------------------------------

下一段：

Browse by use case

不要搞几十个复杂分类。

第一版控制在：

E-commerce
Portrait
Social Media
Video
Brand
Character
Design

每个分类都配高质量作品缩略图。

--------------------------------------------------

首页靠近底部：

New Releases
或者
Recently Added

横向展示新品。

--------------------------------------------------

底部：

一个很大的 CTA：

Stop prompting from scratch.

Explore all templates →

视觉上简洁但非常有力量。

--------------------------------------------------
六、Explore / 商城页面
--------------------------------------------------

URL 示例：

/explore

这是核心商品浏览页。

顶部不要复杂 Hero。

大标题：

Explore

副标题一句话。

下面：

搜索框
分类筛选
类型筛选
模型筛选
价格筛选
排序

类型：

All
Packs
Templates
Free
Workflow

排序：

Popular
Newest
Price
Trending

主体使用漂亮的大图 Grid。

重点还是：
图片大。
文字少。

商品卡 Hover：
轻微图片缩放
显示更多信息
不能有廉价动效。

--------------------------------------------------
七、分类页
--------------------------------------------------

URL：

/category/ecommerce
/category/portrait
/category/social
/category/video
...

每个分类顶部：

超大类别标题

例如：

E-commerce

一句描述：

AI templates for product images, ads and storefront content.

下方精选作品大图。

然后商品 Grid。

每一个分类页都应该像一个小型 Editorial Collection，
而不是简单筛选结果。

--------------------------------------------------
八、商品详情页
--------------------------------------------------

这是整个网站最重要的页面。

URL：

/pack/[slug]

第一屏采用类似高级时尚商品 / 数字产品页布局。

桌面：

左侧约 60%：
作品 Gallery

右侧约 40%：
商品信息

内容包括：

Pack 名称
一句结果导向文案
价格
评价（没有真实数据之前不要造假）
模板数量
兼容模型
更新日期
Buy now
Preview free samples

购买按钮明显但不要廉价。

--------------------------------------------------

作品 Gallery 必须非常漂亮。

可以：

第一张巨大主图
下面 2×2
继续瀑布流展示

作品之间保持统一视觉比例。

支持点击大图预览。

--------------------------------------------------

商品详情部分必须继续向下。

Section：

What you'll create

展示最终效果。

只用短标题 + 图片。

--------------------------------------------------

Section：

Before → After

至少 3 组。

--------------------------------------------------

Section：

What's inside

例如：

30 production-ready prompts
10 visual styles
5 product scenes
Prompt variables
Usage guide
Reference examples

不要写长篇大论。

--------------------------------------------------

Section：

Template Preview

这一块非常关键。

展示真实 Prompt。

例如：

[SUBJECT]
[STYLE]
[LIGHTING]
[BACKGROUND]
[CAMERA]
[OUTPUT]

让用户能够看到结构。

其中部分免费模板：

Copy Prompt

付费内容：

模糊 / 锁定。

CTA：

Unlock full pack

--------------------------------------------------

Section：

Works with

用漂亮的 Logo / 文字表示：

ChatGPT Image
Midjourney
Flux
Gemini
其他实际支持模型

不要假装所有 Prompt 都适配所有模型。

商品数据里应该明确保存 modelCompatibility。

--------------------------------------------------

Section：

Examples

大图作品展示。

可以采用：
两列 Editorial Grid
或者 Masonry。

--------------------------------------------------

Section：

You may also like

展示 3–4 个相关 Pack。

--------------------------------------------------
九、单个免费模板页面
--------------------------------------------------

URL：

/template/[slug]

用途：

SEO
分享
获客
展示能力

页面：

最终效果大图

模板名称

用途

Prompt

Copy Prompt 按钮

变量说明

Example output

Tips

属于哪个 Pack

底部：

Want more like this?

View full pack →

--------------------------------------------------
十、Free 页面
--------------------------------------------------

URL：

/free

标题：

Free AI Templates

这里只展示可以直接免费复制的高质量模板。

重点：
免费内容同样必须漂亮。

不能让 Free 页面变成“垃圾模板区”。

每个模板：

作品
名称
模型
Copy Prompt

点击进入模板详情。

--------------------------------------------------
十一、搜索
--------------------------------------------------

搜索体验必须做好。

点击 Search：

可以出现全屏搜索层。

超大搜索输入框：

Search templates, styles or use cases...

实时显示：

Templates
Packs
Categories

搜索 UI 保持极简。

支持：

product
portrait
cinematic
hair
poster
ecommerce
3D character

等关键词。

--------------------------------------------------
十二、购物 / Checkout
--------------------------------------------------

第一版保持非常简单。

如果项目已经有支付系统，
复用。

如果没有，
把支付层封装清楚，
先做好 mock / placeholder，
方便以后接 Stripe 或其他支付。

Checkout 页面不要像复杂电商。

显示：

商品封面
商品名称
价格
支付方式
总计

按钮：

Complete purchase

同时明确：

Digital product
Instant access
Download anytime

不要编造退款承诺。

--------------------------------------------------
十三、购买成功页
--------------------------------------------------

URL：

/success

视觉上漂亮。

大标题：

It's yours.

商品封面

按钮：

Open Pack
Download Files

辅助：

We've also sent the access link to your email.

如果邮件系统目前没有实现，
不要假装已经发送。
开发环境可注明 TODO / Demo。

--------------------------------------------------
十四、My Library
--------------------------------------------------

URL：

/library

这是用户购买后的数字资产库。

标题：

My Library

大尺寸封面 Grid。

用户购买过的内容：

Pack cover
名称
更新时间
Open
Download

点击 Pack：

进入购买后的 Pack 阅读页面。

--------------------------------------------------
十五、已购买 Pack 阅读页面
--------------------------------------------------

URL：

/library/[slug]

这是实际交付体验。

不要只给 PDF 下载。

网页本身就是产品。

页面左侧 / 顶部：

分类目录

例如：

01 Product Hero
02 Clean Studio
03 Luxury
04 Lifestyle
05 Campaign

每个 Prompt 单元：

效果图
名称
简短说明
Prompt
Copy 按钮
变量
推荐模型
使用 Tips

Copy Prompt 是最核心动作。

同时：

Download full pack

提供 ZIP / PDF / TXT 等下载位置。

第一版即使下载还没有真实文件，
结构也必须预留。

--------------------------------------------------
十六、用户 Account
--------------------------------------------------

保持简单：

Profile
Purchases
Downloads
Sign out

不要一上来做复杂 Settings Dashboard。

--------------------------------------------------
十七、About
--------------------------------------------------

About 页面不要写企业官话。

视觉非常简单。

大标题：

Built for people who want results,
not prompt engineering.

解释：

我们测试 AI 创作方法，
把有效结果整理成可以直接复用的模板。

短即可。

继续大量使用作品图片。

--------------------------------------------------
十八、商品数据结构
--------------------------------------------------

请设计可扩展的数据结构。

Pack 至少需要：

id
slug
title
subtitle
description
coverImage
galleryImages
beforeAfter
category
type
price
currency
templateCount
modelCompatibility
tags
featured
free
createdAt
updatedAt
includedItems
templates
downloadFiles

Template 至少：

id
slug
title
description
prompt
variables
tips
outputImages
modelCompatibility
category
packId
isFree

先可以使用本地 mock 数据，
但组件与数据结构必须为以后数据库做好准备。

不要把商品内容全部硬编码进 React 页面。

--------------------------------------------------
十九、设计组件
--------------------------------------------------

建立统一组件：

Header
Footer
Hero
SectionHeader
ArtworkGrid
PackCard
TemplateCard
CategoryCard
BeforeAfter
PromptPreview
PromptCopyButton
ModelBadge
Price
Gallery
SearchOverlay
FilterBar
EmptyState
CTASection

避免一个页面一套风格。

--------------------------------------------------
二十、动效
--------------------------------------------------

动效需要有，
但必须克制。

允许：

图片 Hover 轻微 Scale
卡片 Hover 位移 2–4px
文字淡入
滚动 reveal
Gallery smooth transition
按钮轻微反馈
页面切换淡入

不要：

疯狂 Parallax
3D 转动
粒子特效
发光边框
光标跟随一大坨
持续移动背景

目标：

“贵”

不是：

“炫技”。

--------------------------------------------------
二十一、手机端
--------------------------------------------------

不要只做桌面。

必须认真设计 Mobile。

尤其：

Hero
商品详情
Gallery
购买按钮
Prompt Copy
筛选
Library

手机商品详情页：

图片在上
信息在下

Buy 按钮可以在手机底部 Sticky，
但不要挡内容。

--------------------------------------------------
二十二、真实感规则
--------------------------------------------------

非常重要：

不要生成假的：

用户数
销售额
评价
星级
“已有 100,000 用户”
“Best #1”
“Trusted by...”

除非项目真实数据存在。

没有数据的模块宁可不显示。

--------------------------------------------------
二十三、图片策略
--------------------------------------------------

视觉作品是网站最重要资产。

项目先建立：

/public/demo/

用于 Demo 图。

如果已有商品图，
优先复用。

如果暂无足够图片：

创建非常漂亮的 placeholder，
但不要使用廉价灰框。

可以使用统一比例的抽象照片占位，
并明确标记 Demo。

所有图片必须：
object-fit 正确
不卡布局
支持 lazy load
合理尺寸
保持性能

--------------------------------------------------
二十四、SEO
--------------------------------------------------

每个：

Pack
Template
Category

必须有独立 URL。

设置：

title
description
Open Graph
canonical
structured metadata（合适时）

免费 Template 页面以后承担自然搜索流量。

--------------------------------------------------
二十五、性能与工程质量
--------------------------------------------------

要求：

TypeScript
响应式
组件化
语义 HTML
可访问性
图片优化
合理 loading state
合理 error state
无明显 console error
无 broken route

如果项目已有：
Next.js
React
Tailwind
shadcn

优先沿用。

不要为了展示能力装几十个不必要依赖。

--------------------------------------------------
二十六、开发方式
--------------------------------------------------

不要一上来给我写几十页重复代码。

按下面顺序：

第一步：
审计当前 repo。

第二步：
告诉我现有结构以及你准备复用什么。

第三步：
建立完整 Design System。

第四步：
先实现：

Home
Explore
Product Detail

这三个核心页面。

第五步：
确保视觉已经达到精品网站标准。

第六步：
继续：

Template
Free
Category
Search
Checkout
Success
Library
Account
About

第七步：
做完整 Responsive QA。

第八步：
运行项目，
逐页检查。

发现：
溢出
错位
字体
间距
图片比例
手机问题
路由问题

直接修。

不要做到“代码能运行”就结束。

--------------------------------------------------
二十七、最重要的设计判断
--------------------------------------------------

请始终记住：

这个网站真正出售的不是 Prompt 文本。

而是：

“我可以做出这个结果。”

所以每个页面都应该遵循：

RESULT FIRST.

图片 > 结果 > 场景 > 模板 > Prompt > 购买

而不是：

Prompt 名称 > 一大段文字 > Buy。

如果一个页面文字很多、作品很小，
说明设计方向错了。

如果看起来像普通 SaaS，
说明设计方向错了。

如果用户打开网站 3 秒，
不知道这里到底能做出什么，
说明设计方向错了。

--------------------------------------------------
二十八、视觉验收标准
--------------------------------------------------

最终我要看到的网站应该让我感觉：

“这是一个真正有人花钱设计过的数字产品网站。”

而不是：

“这是 AI 五分钟生成的 Tailwind 模板。”

要求：

首页第一屏有记忆点
大字体漂亮
作品占据主要视觉面积
页面节奏有变化
留白大胆
商品详情足够漂亮
图片排列有 Editorial 感
卡片不过度
CTA 清楚
移动端优秀
整个品牌统一

请主动做设计判断，
不要每个小地方都问我。

如果某些内容缺失：
使用合理 Demo 数据和占位，
但绝对不要伪造社会证明或商业数据。

现在开始：

1. 先检查整个 repo。
2. 分析现有页面与组件。
3. 给出简短实施方案。
4. 然后直接开始修改和实现。
5. 每完成一个主要页面都在浏览器中实际检查。
6. 最后再次整体视觉 QA，而不是仅仅报告“build success”。
