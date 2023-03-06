<template>
    <el-container style="height: 500px; border: 1px solid #eee">
        <el-header>
            <commonHead name="王泽帆" number="20201002959"></commonHead>
        </el-header>
        <el-container>
            <el-aside width="200px" style="background-color: #dfedff">
                <sidebar></sidebar>
            </el-aside>
            <el-main >
            </el-main>
        </el-container>
    </el-container>
</template>

<script>
import commonHead from "@/components/common/Head.vue"
import sidebar from "@/components/common/SideBar.vue"

export default {
    components: {
        commonHead,
        sidebar
    }
}
</script>

<style>
.el-header {
    background-color: #eef3ff;
    color: #333;
}
</style>