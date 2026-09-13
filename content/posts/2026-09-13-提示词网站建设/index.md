---
title: "提示词网站建设"
date: 2026-09-13T12:00:00+08:00
categories:
  - 亲
draft: false
---

你现在不是在给我做一个普通的 AI SaaS 网站。

你要同时作为：

产品经理
高级 UI/UX 设计师
前端工程师
电商转化设计师
技术架构师

在我现有项目基础上，重新设计并实现一个：

“高质量 AI 成果模板 / Prompt Pack 商店”

注意：

这次不要把项目做成一个功能很多但没有高级感的 AI SaaS。

当前最高优先级是：

视觉质量
商品展示
结果展示
购买欲望
真实产品感

不是后台功能数量。

==================================================
01｜第一步：先检查现有项目
==================================================

你可以直接访问当前 repo。

请你自己完整检查：

- package.json
- 当前技术栈
- 目录结构
- 路由结构
- 页面
- Components
- Styles
- API
- 数据库
- Auth
- Payment
- 已有资产
- 已经可以工作的功能

原则：

不要为了重构而重构。

已有东西能复用就复用。

不要随意删掉现有功能。

如果现有：

Next.js
React
TypeScript
Tailwind
shadcn
Supabase
其他成熟结构

都优先延续现有项目。

先做 Repo Audit。

然后告诉我：

哪些继续使用
哪些修改
哪些新增
哪些现在不做

然后直接开始实施。

不要让我手动给你整理 package.json、目录树和路由。
你自己检查当前 repo。

==================================================
02｜产品定位
==================================================

这个网站不是：

“10000 个 Prompt 搜索网站”

也不是：

Prompt Library
Prompt Wikipedia
AI 工具导航站
普通 AI SaaS

我们的真正定位是：

“AI 成果模板商店”

核心逻辑：

用户不是为了购买几行 Prompt。

用户购买的是：

“我用了这个模板，也可以做出这种结果。”

所以整个网站必须遵循：

RESULT FIRST

结果
↓
案例
↓
使用场景
↓
模板
↓
Prompt
↓
购买

而不是：

Prompt 名称
↓
大段解释
↓
价格

未来商品类型可以包括：

Prompt Pack
Template Pack
Workflow
Skill
Agent
Asset Pack
视觉模板
内容模板

但第一阶段重点仍然是：

Prompt Pack + Template Pack

==================================================
03｜第一版范围
==================================================

不要一次性实现十几个复杂页面。

第一阶段优先做：

Home
Explore
Pack Detail
Free / Template
Checkout Mock
Success
Library Demo

其中最重要的是：

Home
Explore
Pack Detail

先把这三个页面做到：

“像真正专业设计团队做出来的网站。”

宁可只有 3 个非常漂亮的页面，

也不要 15 个普通 AI 模板页面。

Category
Search
Account
About
完整后台

可以后续逐步补。

==================================================
04｜整体视觉方向
==================================================

我要：

高级
极简
现代
编辑感
Editorial
强视觉
大字体
大图片
大量留白
高级数字商品商店感

不是廉价 AI 网站。

不要：

紫蓝渐变满屏
AI 机器人
AI 大脑
霓虹灯
疯狂发光
粒子
复杂玻璃拟态
传统 SaaS Dashboard
满屏小卡片
廉价 Icon 堆叠
典型模板站

整体感觉：

现代设计工作室
+
高级数字商品商店
+
创意作品平台
+
时尚杂志 Editorial Website

允许主动联网研究优秀网站。

重点研究：

高级 AI Creative Tool
设计作品网站
Digital Product Store
Editorial Website
Creative Studio Website

研究它们：

Hero
字体
留白
图片比例
Grid
详情页
Hover
商品展示
页面节奏

可以学习设计规律。

不要复制：

Logo
品牌
文案
作品
视觉资产

==================================================
05｜视觉系统
==================================================

整体背景：

暖白
米白
浅灰白

不要纯死白。

主文字：

接近黑色。

辅助文字：

中性灰。

边框：

极浅灰。

强调色：

只使用一种低饱和强调色。

不要彩虹配色。

阴影：

极弱。

更多依靠：

留白
边框
比例
字体
图片

形成层次。

圆角：

适度。

不要全部巨大圆角。

字体：

中文：
现代干净黑体。

英文：
高级 Sans Serif。

核心视觉：

BIG TYPE。

桌面 Hero 主标题：

允许 72px–120px。

根据页面视觉自动调整。

手机端重新设计比例，
不要只是简单缩小 Desktop。

==================================================
06｜Header
==================================================

Header 极简。

左：

Logo / Wordmark

右侧：

Explore
Packs
Free
Search
My Library
Account

不要放太多。

可以 Sticky。

滚动后允许：

轻微背景变化
浅色背景
很弱 Blur

不要重玻璃效果。

==================================================
07｜HOME 首页
==================================================

首页不要做传统 SaaS Landing Page。

第一屏必须非常强。

Hero 示例：

Create better with AI.
Start from what already works.

或者：

Don't start from a blank prompt.

副标题：

Curated AI templates built around real results.

CTA：

Explore Packs
Try Free Templates

Hero 周围必须展示：

真正的最终成果图。

不要抽象 AI 图标。

可以使用：

大图
不对称 Editorial Grid
Masonry
横向作品展示

目标：

用户进入网站 3 秒内就知道：

“这个网站可以让我做出这些东西。”

--------------------------------------------------

Hero 下方：

Featured Results

展示 6–10 张精品作品。

图片必须大。

Hover 后显示：

Template Name
Category
Model
View Template

先让用户看作品，

然后再知道模板。

--------------------------------------------------

Popular Packs

大尺寸商品卡。

不要一屏塞 6 个小卡片。

桌面一屏：

2–3 个商品即可。

Pack 信息：

封面
名称
一句结果导向描述
模板数量
类别
价格
兼容模型

例如：

AI Product Photography Pack

Turn ordinary product shots into polished campaign visuals.

30 Templates

--------------------------------------------------

Before / After

这是首页重点。

展示：

普通输入
→
使用模板后的成果

例如：

普通商品图
→
高级电商广告图

普通自拍
→
高级发型分析图

普通人物
→
角色设定图

普通照片
→
杂志视觉

支持：

并排
或
滑动对比

--------------------------------------------------

Free Templates

展示少量真正优秀的免费模板。

每个可以：

Preview
Copy Prompt

免费内容承担获客。

不要把 Free 做成垃圾区。

--------------------------------------------------

Browse by Use Case

第一版类别不要太多。

例如：

E-commerce
Portrait
Social Media
Video
Brand
Character
Design

每个类别必须有作品图。

--------------------------------------------------

页面底部：

大 CTA。

例如：

Stop prompting from scratch.

Explore all templates →

==================================================
08｜EXPLORE
==================================================

URL：

/explore

顶部：

大标题：

Explore

一句副标题。

下面：

Search
Category
Type
Model
Price
Sort

但第一版筛选不用做复杂。

Type：

All
Packs
Templates
Free

Sort：

Popular
Newest
Price

主体：

大图片 Grid。

重点：

作品大
文字少

商品卡 Hover：

轻微 scale
很弱位移
显示详情

不要廉价动画。

==================================================
09｜PACK DETAIL
==================================================

这是全站最重要页面。

URL：

/pack/[slug]

Desktop 第一屏：

左边约 60%：

Gallery

右边约 40%：

商品信息

包含：

Pack Name
一句结果导向描述
Price
Template Count
Model Compatibility
Updated Date
Buy Now
Preview Free Samples

如果没有真实评价：

不要显示假的星级和评价。

--------------------------------------------------

Gallery：

第一张大图。

下面可以：

2 × 2
Editorial Grid
Masonry

支持点击查看大图。

--------------------------------------------------

继续向下：

What you'll create

只展示：

短标题
+
优秀作品

--------------------------------------------------

Before / After

至少展示 2–3 组。

--------------------------------------------------

What's inside

例如：

30 production-ready templates
10 visual styles
5 product scenes
Prompt variables
Usage guide
Reference examples

简短。

不要大段文案。

--------------------------------------------------

Template Preview

展示真实 Prompt 结构。

例如：

[SUBJECT]
[STYLE]
[LIGHTING]
[BACKGROUND]
[CAMERA]
[OUTPUT]

免费内容：

Copy Prompt

付费内容：

Locked

CTA：

Unlock full pack

--------------------------------------------------

Works With

显示：

ChatGPT Image
Midjourney
Flux
Gemini

但只有真实适配的才显示。

不要默认：

“全平台通用。”

数据结构必须明确：

testedModels
compatibleModels

--------------------------------------------------

Examples

继续大图展示成果。

--------------------------------------------------

You May Also Like

展示 3–4 个相关商品。

==================================================
10｜FREE / TEMPLATE
==================================================

URL：

/free

和：

/template/[slug]

Free 页面：

只展示真正高质量的免费模板。

单模板页面：

最终效果图
名称
用途
Prompt
Copy Prompt
Variables
Tips
Model Compatibility
Example Output
所属 Pack

底部：

Want more like this?

View Full Pack →

免费 Template 以后也是 SEO 入口。

==================================================
11｜CHECKOUT
==================================================

第一版：

先 Mock。

不要现在接复杂支付。

页面保持极简。

显示：

Cover
Product Name
Price
Total

CTA：

Complete Purchase

说明：

Digital product
Instant access

不要伪造退款承诺。

以后再正式接：

Stripe
Paddle
支付宝
微信
其他支付方式

现在不要因为支付系统阻塞整个网站。

==================================================
12｜SUCCESS
==================================================

URL：

/success

大标题：

It's yours.

显示：

商品封面
商品名称

CTA：

Open Pack

Download Files

如果真实邮件系统还没有接：

不要写：

“We've sent it to your email.”

除非已经真的实现。

==================================================
13｜LIBRARY
==================================================

URL：

/library

第一版先 Demo。

展示：

用户已经购买的 Pack。

大尺寸 Grid。

包含：

封面
名称
更新时间
Open
Download

点击进入：

/library/[slug]

后续正式版：

用户购买一个 Pack，

获得的是：

“Pack Access / Entitlement”

不是单纯：

“一个 PDF 下载链接。”

==================================================
14｜PACK 阅读体验
==================================================

购买以后：

网页本身就是产品。

不要只给 PDF。

Pack Reader：

目录

例如：

01 Product Hero
02 Clean Studio
03 Luxury
04 Lifestyle
05 Campaign

每个 Template：

效果图
标题
简短说明
Prompt
Copy
Variables
Model
Tips

同时允许：

Download Full Pack

未来可以提供：

ZIP
PDF
TXT
MD

但在线阅读体验优先。

==================================================
15｜商品数据结构
==================================================

建立可扩展 TypeScript 数据结构。

Pack 至少：

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
testedModels
compatibleModels
tags
featured
free
status
version
changelog
license
createdAt
updatedAt
includedItems
previewTemplateIds
relatedPackIds
downloadFiles
seo

Template 至少：

id
slug
title
description

promptTemplate

variables[]

tips[]

outputImages[]

testedModels[]

compatibleModels[]

category

packId

isFree

不要只把 Prompt 存成一整段死字符串。

Prompt 应该支持变量化。

例如：

{
  name: "product",
  label: "Product",
  placeholder: "white running shoes"
}

==================================================
16｜图片资产
==================================================

这个项目必须高度重视图片。

这个网站的高级感：

很大程度不是来自代码，

而是来自：

成果图。

建立：

/public/demo/

统一管理 Demo 作品。

建议结构：

/public/demo/ecommerce/
/public/demo/portrait/
/public/demo/social/
/public/demo/character/

图片要：

统一比例
命名清晰
版权清晰
可追踪来源

如果暂时没有真实作品：

可以用高级 Placeholder。

但是不要用：

灰色方块
随机 Unsplash
廉价图库

正式上线前：

必须逐步替换成真实 AI 成果案例。

==================================================
17｜图片性能
==================================================

使用：

WebP / AVIF
responsive images
srcset
lazy loading

但是：

首屏 LCP Hero 图不要 lazy。

保证：

object-fit
aspect-ratio
没有 Layout Shift
移动端不过度加载大图

==================================================
18｜付费 Prompt 保护
==================================================

非常重要：

不要把真实完整付费 Prompt：

直接硬编码进 Production Frontend Bundle，

然后只通过 CSS blur 隐藏。

这不是真正保护。

第一阶段：

使用 Mock Locked Content。

预留：

getTemplatePreview()

getPurchasedTemplate()

hasEntitlement()

正式版：

用户购买后，

由 Server / API 鉴权，

确认 entitlement 后，

再返回完整付费内容。

同时接受：

Prompt 一旦用户复制，

无法彻底防止二次传播。

不要设计过度 DRM。

==================================================
19｜后端策略
==================================================

现在：

考虑后端架构。

但不要：

一次性把完整后端全部做完。

当前不要因为：

Database
Auth
Payment
Email
Storage
Admin

拖慢前台开发。

建立 Service Layer：

productService
templateService
authService
paymentService
purchaseService
downloadService
emailService

当前允许：

Mock implementation。

页面只调用：

getPacks()
getPack(slug)
getTemplate(slug)
getUserLibrary()
hasPurchased()
createCheckout()
getDownloadUrl()

不要让页面直接依赖：

Stripe
Supabase
Firebase
Paddle

未来换真实后端时：

尽量只换 Service Implementation。

不要重写 UI。

==================================================
20｜购买权限模型
==================================================

正式逻辑应该是：

User
↓
Purchase
↓
Entitlement
↓
Pack
↓
Templates + Files

用户购买 Pack 后获得：

完整模板访问权
Prompt Copy
案例
未来更新
文件下载

不是：

User
↓
一个静态 PDF 链接

==================================================
21｜当前不要做
==================================================

第一阶段暂时不要实现：

复杂 Admin Dashboard
Affiliate
Coupon
Reviews
Ratings
Subscription
Recommendation Engine
复杂 Analytics
复杂 DRM
AI 自动生成后台
复杂会员等级
复杂社交系统

除非现有项目已经有：

并且复用成本极低。

==================================================
22｜Components
==================================================

先做必要组件：

Header
Footer
Hero
SectionHeader
PackCard
TemplateCard
CategoryCard
ArtworkGrid
BeforeAfter
PromptPreview
PromptCopyButton
ModelBadge
Gallery
FilterBar
Search
EmptyState
CTASection

不要为了抽象而抽象。

不要提前创建几十个没有实际使用的组件。

==================================================
23｜动效
==================================================

允许：

图片 Hover Scale
2–4px 位移
Fade
Scroll Reveal
Gallery Transition
按钮轻微反馈

不要：

粒子
疯狂 Parallax
3D 卡片旋转
光标跟随
持续动画背景
发光边框

目标：

“贵”

不是：

“炫技”。

==================================================
24｜Mobile
==================================================

必须认真做 Mobile。

不是 Desktop 缩小版。

重点检查：

Hero
Gallery
Pack Detail
Buy
Prompt Copy
Filter
Library

Pack Detail Mobile：

图片在上

商品信息在下。

Buy 可以：

Bottom Sticky

但：

不能挡内容。

==================================================
25｜真实感规则
==================================================

禁止伪造：

用户数
销量
Reviews
Stars
Trusted by
Best #1
100,000 Users
品牌合作
媒体报道

没有真实数据：

宁可不显示。

Demo 数据：

可以用于
