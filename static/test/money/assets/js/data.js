/*
 * 赚钱本能测试 · 内容与规则配置
 * ---------------------------------------------------------------
 * 这个文件是整个测试唯一的“内容来源”。要改题、改选项、改结果文案、
 * 改分值，只改这里就行，不需要动 app.js。
 *
 *  - questions     8 道题，每题 4 个选项；选项的 scores 就是它的加分
 *  - resultTypes   8 种赚钱人格的对外信息（名称、标签）
 *  - resultCopy    8 种结果的正文文案
 *  - scoringRules  计分与并列打破规则
 *  - analysisSteps 提交后的“分析中”文案（progress 字段是原版遗留数据，未使用）
 *  - cover         首页封面文案
 *
 * 分数含义：主类型 +2 分、次类型 +1 分；总分最高者胜出。
 * 图片路径都相对于本页 /test/money/。
 */
window.MoneyTestData = {
  meta: {
    title: "赚钱本能测试",
    heading: "你天生该吃哪碗饭？",
    description: "8 个选择，看清你更自然的赚钱方式。纯趣味测试，结果仅供娱乐。"
  },

  cover: {
    eyebrow: "FIND YOUR WAY",
    titleLines: ["你天生","该吃哪碗饭？"],
    subtitle: "8 个选择，看清你更自然的赚钱方式",
    bullets: ["8 道场景选择","8 种赚钱人格","约 2 分钟完成"],
    footnote: "纯趣味测试 · 结果仅供娱乐",
    cta: "开始测试 →",
    image: "assets/img/cover.jpg",
    imageAlt: "清晨海边露台",
    verdictBadge: "测测你天生该吃哪碗饭？",
    shareLabel: "我的结果",
    shareFooterTop: "你靠什么吃饭？",
    shareFooterBottom: "FIND YOUR WAY"
  },

  analysisSteps: [
  { text: "正在拆解你的选择……", progress: 23 },
  { text: "寻找你最自然的价值交换方式", progress: 47 },
  { text: "分析你面对机会、风险与工作的本能", progress: 76 }
  ],
  analysisTail: "你的结果已经出现。",

  scoringRules: {
    types: ["R1","R2","R3","R4","R5","R6","R7","R8"],
    strongHitPoints: 2,
    tieBreak: {
      primaryQuestion: 8,
      secondaryQuestion: 1
    }
  },

  questions: [
  {
    id: 1,
    title: "突然多出一个完全属于你的周末，你最容易干什么？",
    options: [
      {
        id: "A",
        text: "把脑子里一直想做的东西真正做出来",
        image: "assets/img/q1-a.jpg",
        scores: [
          { type: "R1", points: 2 },
          { type: "R6", points: 1 }
        ]
      },
      {
        id: "B",
        text: "逛市场、刷平台，看看最近什么东西正在赚钱",
        image: "assets/img/q1-b.jpg",
        scores: [
          { type: "R2", points: 2 },
          { type: "R8", points: 1 }
        ]
      },
      {
        id: "C",
        text: "把最近乱七八糟的事情全部重新整理一遍",
        image: "assets/img/q1-c.jpg",
        scores: [
          { type: "R3", points: 2 },
          { type: "R4", points: 1 }
        ]
      },
      {
        id: "D",
        text: "找一个朋友长聊，顺手帮他把困惑理明白",
        image: "assets/img/q1-d.jpg",
        scores: [
          { type: "R7", points: 2 },
          { type: "R5", points: 1 }
        ]
      }
    ]
  },
  {
    id: 2,
    title: "第一次接触一个完全陌生的新东西，你更习惯怎么开始？",
    options: [
      {
        id: "A",
        text: "先找教程，照着做一个能跑起来的东西",
        image: "assets/img/q2-a.jpg",
        scores: [
          { type: "R4", points: 2 },
          { type: "R6", points: 1 }
        ]
      },
      {
        id: "B",
        text: "先搞懂它的原理、规则和底层逻辑",
        image: "assets/img/q2-b.jpg",
        scores: [
          { type: "R5", points: 2 },
          { type: "R3", points: 1 }
        ]
      },
      {
        id: "C",
        text: "马上开始想：它还能被做成什么有意思的东西？",
        image: "assets/img/q2-c.jpg",
        scores: [
          { type: "R1", points: 2 },
          { type: "R8", points: 1 }
        ]
      },
      {
        id: "D",
        text: "先看看谁真正需要它，以及谁愿意为它买单",
        image: "assets/img/q2-d.jpg",
        scores: [
          { type: "R2", points: 2 },
          { type: "R7", points: 1 }
        ]
      }
    ]
  },
  {
    id: 3,
    title: "四个人一起做项目，突然乱成一团，你最自然的反应是？",
    options: [
      {
        id: "A",
        text: "把事情拆开，排优先级，重新分工",
        image: "assets/img/q3-a.jpg",
        scores: [
          { type: "R3", points: 2 },
          { type: "R8", points: 1 }
        ]
      },
      {
        id: "B",
        text: "找到最难解决的那个问题，直接开始啃",
        image: "assets/img/q3-b.jpg",
        scores: [
          { type: "R4", points: 2 },
          { type: "R5", points: 1 }
        ]
      },
      {
        id: "C",
        text: "去沟通、找资源、想办法让事情继续往前走",
        image: "assets/img/q3-c.jpg",
        scores: [
          { type: "R2", points: 2 },
          { type: "R7", points: 1 }
        ]
      },
      {
        id: "D",
        text: "先离开混乱，把自己能做的关键部分独立做完",
        image: "assets/img/q3-d.jpg",
        scores: [
          { type: "R6", points: 2 },
          { type: "R1", points: 1 }
        ]
      }
    ]
  },
  {
    id: 4,
    title: "下面哪种评价最容易真正让你开心？",
    options: [
      {
        id: "A",
        text: "「这个东西你怎么想到的？很有感觉。」",
        image: "assets/img/q4-a.jpg",
        scores: [
          { type: "R1", points: 2 },
          { type: "R5", points: 1 }
        ]
      },
      {
        id: "B",
        text: "「你真的挺会抓机会，也挺会谈。」",
        image: "assets/img/q4-b.jpg",
        scores: [
          { type: "R2", points: 2 },
          { type: "R8", points: 1 }
        ]
      },
      {
        id: "C",
        text: "「交给你我就放心，你总能把事情弄明白。」",
        image: "assets/img/q4-c.jpg",
        scores: [
          { type: "R3", points: 2 },
          { type: "R4", points: 1 }
        ]
      },
      {
        id: "D",
        text: "「不知道为什么，跟你聊完以后我清楚多了。」",
        image: "assets/img/q4-d.jpg",
        scores: [
          { type: "R7", points: 2 },
          { type: "R6", points: 1 }
        ]
      }
    ]
  },
  {
    id: 5,
    title: "如果现在突然给你 5 万元，只允许用来提升未来赚钱能力，你更想怎么花？",
    options: [
      {
        id: "A",
        text: "买设备、学一门真正能长期积累的硬技能",
        image: "assets/img/q5-a.jpg",
        scores: [
          { type: "R4", points: 2 },
          { type: "R6", points: 1 }
        ]
      },
      {
        id: "B",
        text: "拿一小部分钱直接测试一个生意",
        image: "assets/img/q5-b.jpg",
        scores: [
          { type: "R8", points: 2 },
          { type: "R2", points: 1 }
        ]
      },
      {
        id: "C",
        text: "做一个真正属于自己的作品、账号或者产品",
        image: "assets/img/q5-c.jpg",
        scores: [
          { type: "R1", points: 2 },
          { type: "R5", points: 1 }
        ]
      },
      {
        id: "D",
        text: "建立一套长期稳定工作的环境、流程和工具",
        image: "assets/img/q5-d.jpg",
        scores: [
          { type: "R3", points: 2 },
          { type: "R7", points: 1 }
        ]
      }
    ]
  },
  {
    id: 6,
    title: "下面哪种工作最容易把你耗空？",
    options: [
      {
        id: "A",
        text: "每天大量无意义社交，而且自己几乎没有决定权",
        image: "assets/img/q6-a.jpg",
        scores: [
          { type: "R6", points: 2 },
          { type: "R4", points: 1 }
        ]
      },
      {
        id: "B",
        text: "永远重复同样的东西，没有任何发挥空间",
        image: "assets/img/q6-b.jpg",
        scores: [
          { type: "R1", points: 2 },
          { type: "R8", points: 1 }
        ]
      },
      {
        id: "C",
        text: "天天临时改需求，没有标准，也没人负责",
        image: "assets/img/q6-c.jpg",
        scores: [
          { type: "R3", points: 2 },
          { type: "R2", points: 1 }
        ]
      },
      {
        id: "D",
        text: "所有决定都靠感觉，没人愿意看事实和数据",
        image: "assets/img/q6-d.jpg",
        scores: [
          { type: "R5", points: 2 },
          { type: "R7", points: 1 }
        ]
      }
    ]
  },
  {
    id: 7,
    title: "如果你的收入突然不稳定，你最可能先做哪件事？",
    options: [
      {
        id: "A",
        text: "马上找客户、找商品、找能快速成交的机会",
        image: "assets/img/q7-a.jpg",
        scores: [
          { type: "R2", points: 2 },
          { type: "R8", points: 1 }
        ]
      },
      {
        id: "B",
        text: "继续把自己最值钱的技能练得更硬",
        image: "assets/img/q7-b.jpg",
        scores: [
          { type: "R4", points: 2 },
          { type: "R6", points: 1 }
        ]
      },
      {
        id: "C",
        text: "把收入来源全部拆开，看看真正的问题在哪里",
        image: "assets/img/q7-c.jpg",
        scores: [
          { type: "R5", points: 2 },
          { type: "R3", points: 1 }
        ]
      },
      {
        id: "D",
        text: "把自己会的东西整理出来，尝试教别人或提供服务",
        image: "assets/img/q7-d.jpg",
        scores: [
          { type: "R7", points: 2 },
          { type: "R1", points: 1 }
        ]
      }
    ]
  },
  {
    id: 8,
    title: "下面哪一个画面最像你心里真正意义上的「混得不错」？",
    options: [
      {
        id: "A",
        text: "做出的东西被很多人看到、使用和喜欢",
        image: "assets/img/q8-a.jpg",
        scores: [
          { type: "R1", points: 2 },
          { type: "R8", points: 1 }
        ]
      },
      {
        id: "B",
        text: "谈下一笔漂亮的合作，看着钱真正到账",
        image: "assets/img/q8-b.jpg",
        scores: [
          { type: "R2", points: 2 },
          { type: "R3", points: 1 }
        ]
      },
      {
        id: "C",
        text: "自己搭好的体系稳定运转，不需要天天救火",
        image: "assets/img/q8-c.jpg",
        scores: [
          { type: "R3", points: 2 },
          { type: "R5", points: 1 }
        ]
      },
      {
        id: "D",
        text: "某项能力做到很强，别人愿意专门花高价找你",
        image: "assets/img/q8-d.jpg",
        scores: [
          { type: "R4", points: 2 },
          { type: "R6", points: 1 }
        ]
      }
    ]
  }
  ],

  resultTypes: [
  {
    id: "R1",
    name: "灵感造物者",
    keywords: ["审美","创意","表达","产品感"],
    shareKeywords: ["创造","表达","审美"]
  },
  {
    id: "R2",
    name: "交易猎手",
    keywords: ["成交","嗅觉","资源","人性"],
    shareKeywords: ["成交","嗅觉","资源"]
  },
  {
    id: "R3",
    name: "系统掌盘者",
    keywords: ["秩序","运营","推进","统筹"],
    shareKeywords: ["秩序","运营","统筹"]
  },
  {
    id: "R4",
    name: "硬核匠人",
    keywords: ["技术","手艺","专业","深度"],
    shareKeywords: ["技术","手艺","专业"]
  },
  {
    id: "R5",
    name: "深水洞察者",
    keywords: ["分析","判断","研究","策略"],
    shareKeywords: ["分析","判断","策略"]
  },
  {
    id: "R6",
    name: "自由游牧者",
    keywords: ["自主","灵活","独立","边界"],
    shareKeywords: ["自主","灵活","独立"]
  },
  {
    id: "R7",
    name: "人心点灯者",
    keywords: ["共情","教育","陪伴","信任"],
    shareKeywords: ["共情","教育","信任"]
  },
  {
    id: "R8",
    name: "野生开拓者",
    keywords: ["机会","冒险","创业","从0到1"],
    shareKeywords: ["机会","冒险","创业"]
  }
  ],

  resultCopy: {
    R1: {
      heroQuote: "你最值钱的能力，是把不存在的东西做出来。",
      why: "你真正擅长的不是执行别人已经定义好的答案，而是把一个模糊念头变成别人愿意看、愿意用、甚至愿意付钱的东西。",
      money: "把「想法」变成有价值的作品。",
      advantages: ["对美与感觉有天然敏锐度，能捕捉别人忽略的质感","擅长把抽象概念转化为具体、可感知的成品","有强烈的产品直觉，知道什么会真正打动人"],
      pitfalls: ["想得漂亮，做得太慢","过度追求完美，迟迟不肯发布","作品很多，真正卖出去的很少"],
      directions: ["内容创作、设计、品牌","产品、视觉、广告、策划","新媒体、创意型电商"],
      advice: ["给自己设定硬性发布节奏，先完成再完美","为每个作品准备一句清晰的「它解决了什么」","建立最小可售卖版本，先验证市场再打磨"],
      goldQuote: "你不一定最会抢机会，但你很会创造原本不存在的东西。"
    },
    R2: {
      heroQuote: "别人看到的是东西，你第一眼看到的往往是它能不能卖。",
      why: "你对「什么东西有人要」「什么人愿意买」「机会藏在哪里」非常敏感。相比慢慢雕刻一个完美作品，你更喜欢真实市场给你的反馈。",
      money: "找到需求，然后促成交换。",
      advantages: ["对市场需求和人性有敏锐嗅觉","善于发现资源并促成连接","行动快，能在机会窗口内果断出手"],
      pitfalls: ["追热点太快，容易疲于奔命","只看短期收益，忽视长期积累","同时开太多战线，精力分散"],
      directions: ["销售、商务、电商、渠道","直播、带货、经纪、采购","撮合型生意"],
      advice: ["选定一两个主战场深耕，避免四面出击","为每笔交易建立可复用的流程与话术","留出时间复盘，哪些机会真正值得长期投入"],
      goldQuote: "别人看到的是东西，你第一眼看到的往往是它能不能卖。"
    },
    R3: {
      heroQuote: "真正适合你的不是做一颗螺丝，而是慢慢成为那个看整台机器的人。",
      why: "你最大的能力不是某一个单点技能，而是把混乱的东西梳理清楚。人、任务、时间、资源到了你手里，会逐渐形成秩序。",
      money: "让一套系统持续产生结果。",
      advantages: ["能把混乱的局面梳理成清晰的流程","善于统筹人、任务、时间与资源","有强烈的推进力，让事情真正落地"],
      pitfalls: ["什么都想自己管，难以放手","长期替别人收拾残局，变成救火的人","容易陷入细节，忽略战略方向"],
      directions: ["运营、项目管理、生产管理","供应链、组织管理、店铺运营","项目交付"],
      advice: ["学会授权与信任，把精力放在关键节点","建立可复制的标准与流程，减少重复救火","定期抽身看全局，调整系统而非修补细节"],
      goldQuote: "真正适合你的不是做一颗螺丝，而是慢慢成为那个看整台机器的人。"
    },
    R4: {
      heroQuote: "你的安全感最终不是别人给你的，而是「这件事我真会」。",
      why: "你比较相信一件事：不会就是不会，会就是会。你更喜欢可以不断练习、积累，而且最终能够用成果证明自己的能力。",
      money: "把一件别人做不了或者做不好的事情做得足够好。",
      advantages: ["在专业领域有深度积累，能解决难题","用成果说话，交付质量稳定可靠","专注且有耐心，能长期打磨一项技能"],
      pitfalls: ["只研究技术，不研究市场与需求","不愿意表达和展示自己","能力涨了，报价却没跟上"],
      directions: ["工程、编程、设备、维修","制造、摄影、剪辑、烘焙、工艺","专业技术岗位"],
      advice: ["定期把能力翻译成别人能理解的价值","主动展示作品与成果，建立专业口碑","让报价匹配你的真实水平，敢于谈钱"],
      goldQuote: "你的安全感最终不是别人给你的，而是「这件事我真会」。"
    },
    R5: {
      heroQuote: "你的优势不是知道得多，而是经常能看到别人忽略的那一层。",
      why: "面对事情，你本能地会问：为什么？数据是什么？真正的问题在哪里？别人急着行动的时候，你更容易看到隐藏条件。",
      money: "比别人更早看懂问题。",
      advantages: ["能透过现象看到本质与隐藏条件","善于用数据与逻辑支撑判断","在信息不完整时也能做出合理推断"],
      pitfalls: ["想得太明白却迟迟不动","分析成瘾，陷入过度研究","总希望获得更多信息后才肯开始"],
      directions: ["数据、研究、策略、咨询","金融分析、产品分析","商业分析、行业研究"],
      advice: ["为分析设定明确的截止线，到点即行动","接受「足够好」的信息，先验证再迭代","把洞察转化为可执行的下一步动作"],
      goldQuote: "你的优势不是知道得多，而是经常能看到别人忽略的那一层。"
    },
    R6: {
      heroQuote: "你真正想挣的不只有钱，还有对自己时间的控制权。",
      why: "你不是天然排斥工作。你真正排斥的是：自己的时间完全不属于自己。当你拥有明确目标，同时又有足够自主权时，你的状态往往最好。",
      money: "用个人能力交换更大的自由度。",
      advantages: ["在自主环境下能爆发出最佳状态","灵活适应不同项目与节奏","有清晰的边界感，懂得保护自己的精力"],
      pitfalls: ["把「自由」误解成没有纪律","收入波动大，缺乏稳定感","缺乏稳定的获客与变现方式"],
      directions: ["自由职业、远程工作","独立开发、摄影、设计","独立顾问、小型个人工作室"],
      advice: ["为自由建立自律的节奏与底线","提前规划收入波动，储备缓冲资金","搭建稳定的获客渠道，减少随机性"],
      goldQuote: "你真正想挣的不只有钱，还有对自己时间的控制权。"
    },
    R7: {
      heroQuote: "你的能力经常藏在一句话里：跟你聊完，我好像明白了。",
      why: "很多人真正愿意为你付钱的原因，不一定是你知道得最多。而是：你能让他听懂、放心，或者重新看清问题。",
      money: "解决人与人的信息、情绪和认知问题。",
      advantages: ["善于倾听，能让人感到被理解与信任","能把复杂的事讲清楚，让人真正听懂","有陪伴感，能持续支持他人成长"],
      pitfalls: ["不好意思收费，低估自己的价值","替别人承担太多，消耗自己","价值很高，却不会产品化"],
      directions: ["教育、培训、咨询","客户成功、服务、社群","知识付费、顾问型工作"],
      advice: ["为自己的时间与专业设定清晰的价格","把经验沉淀成可复用的产品或课程","守住边界，先照顾好自己再帮助他人"],
      goldQuote: "你的能力经常藏在一句话里：跟你聊完，我好像明白了。"
    },
    R8: {
      heroQuote: "你最强的时候，往往不是别人给你一个位置，而是根本没有位置的时候。",
      why: "比起进入已经安排好的位置，你更容易被「能不能自己搞一个？」这种事情吸引。不确定性不一定让你舒服，但可能让你兴奋。",
      money: "发现还没有被满足的需求，然后自己开一条路。",
      advantages: ["对未被满足的需求有敏锐嗅觉","敢于从零开始，快速搭建和试错","有强烈的主动性和资源整合能力"],
      pitfalls: ["开局太多，难以聚焦","容易高估机会、低估执行难度","没形成现金流就开始做第二个项目"],
      directions: ["创业、个人品牌、小生意","新项目、电商、创新业务","资源整合"],
      advice: ["先跑通一个最小闭环，再考虑扩张","为每个项目设定明确的验证标准","建立稳定的现金流，再投入下一个机会"],
      goldQuote: "你最强的时候，往往不是别人给你一个位置，而是根本没有位置的时候。"
    }
  }
};
