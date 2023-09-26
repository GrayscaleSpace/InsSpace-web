<template>
  <div class="about">
    <div class="about-content">
      <h1 style="text-align: center;">免责声明</h1>
      <p><strong>重要提示：</strong>请在使用本网站前仔细阅读以下免责声明。</p>
      <p><strong>1. 壁纸来源：</strong>本网站提供的壁纸资源主要来自于Wallhaven.cc网站以及其他多个壁纸网站。这些壁纸资源均属于第三方网站的内容，我们仅提供链接和展示，并无法控制、编辑或保证其完整性、准确性、合法性或适用性。</p>

      <p><strong>2. 信息准确性：</strong>我们尽力确保本网站上的信息准确无误，但不对其准确性或完整性提供任何明示或暗示的保证。用户应自行核实所需信息。</p>

      <p><strong>3. 知识产权：</strong>本网站的壁纸资源包括但不限于图片、图标、文字等可能受到版权、商标权或其他知识产权法律保护的内容。这些内容的版权归原始所有者所有，仅供个人和非商业用途使用。未经授权不得复制、分发、展示或以其他方式使用。</p>

      <p><strong>4. 风险承担：</strong>用户在本网站上下载或使用壁纸资源时，应自行承担风险。本网站不对用户因使用壁纸资源而可能导致的任何损失或损害承担责任，包括但不限于数据丢失、计算机损坏或其他直接或间接损害。</p>

      <p><strong>5. 第三方链接：</strong>本网站可能包含指向第三方网站的链接。这些链接仅为用户方便提供，不代表本网站对这些网站的内容或可用性负责。用户访问这些链接将受到相应网站的使用条款和隐私政策的约束。</p>

      <p><strong>6. 合法性：</strong>用户使用本网站应遵守适用法律法规。如有违反法律的行为，与本网站无关。</p>

      <p><strong>7. 免责声明的变更：</strong>本网站保留在任何时候修改、补充或撤销本免责声明的权利。所有变更将在本页面上发布并生效。</p>

      <p>通过使用本网站，您表明您已经阅读、理解并同意本免责声明的所有条款和条件。如您不同意本免责声明的任何部分，请停止使用本网站。</p>

      <p>如需法律建议或有关免责声明的特定问题，请咨询专业律师。</p>
    </div>
  </div>
</template>

<script>
export default {
  name: "img-about"
}
</script>

<style scoped>
.about{
  width: 100%;
  display: flex;
  justify-content: center;
}
.about-content{
  width: 50%;
  line-height: 2;
  color: white;
  text-indent: 2em;
}
/* 识别p标签中的强调文本 */
p em {
  font-style: italic; /* 斜体 */
}

/* 识别p标签中的加粗文本 */
p strong {
  font-weight: bold; /* 加粗 */
}

</style>