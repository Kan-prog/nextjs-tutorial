import remark from 'remark'
import html from 'remark-html'
import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

// md形式のデータを入れてあるディレクトリ取得
const postsDirectory = path.join(process.cwd(), 'posts')

// 今回は、md形式のファイルからデータを取得しているが、外部APIやDBに対しても同様にアクセス可能。
// それは、getStaticPropsがサーバーサイドのみで走っているから。
export function getSortedPostsData() {
  // Get file names under /posts
  const fileNames = fs.readdirSync(postsDirectory)

  // postのデータを格納。  
  const allPostsData = fileNames.map(fileName => {
    // Remove ".md" from file name to get id
    // idは各ファイル名から拡張子.mdを取り除いたもの
    const id = fileName.replace(/\.md$/, '')

    // Read markdown file as string
    // ファイルの位置を取得する
    const fullPath = path.join(postsDirectory, fileName)
    // 取得したファイル位置からその内容を読み取り取得する
    const fileContents = fs.readFileSync(fullPath, 'utf8')

    // Use gray-matter to parse the post metadata section
    const matterResult = matter(fileContents)

    // Combine the data with the id
    return {
      id,
      ...matterResult.data
    }
  })
  // Sort posts by date
  // 日時でPostデータをソート
  return allPostsData.sort((a, b) => {
    if (a.date < b.date) {
      return 1
    } else {
      return -1
    }
  })
}

// 以下の形式でidをキーにもつページごとのパラメータが入った配列を生成
export function getAllPostIds() {
    const fileNames = fs.readdirSync(postsDirectory)
  
    // Returns an array that looks like this:
    // [
    //   {
    //     params: {
    //       id: 'ssg-ssr'
    //     }
    //   },
    //   {
    //     params: {
    //       id: 'pre-rendering'
    //     }
    //   }
    // ]
    return fileNames.map(fileName => {
      return {
        params: {
          id: fileName.replace(/\.md$/, '')
        }
      }
    })
}

// 個別のPostデータに対してその内容を取得する
export async function getPostData(id) {
  const fullPath = path.join(postsDirectory, `${id}.md`)
  const fileContents = fs.readFileSync(fullPath, 'utf8')

  // Use gray-matter to parse the post metadata section
  const matterResult = matter(fileContents)

  // Use remark to convert markdown into HTML string
  const processedContent = await remark()
    .use(html)
    .process(matterResult.content)
  const contentHtml = processedContent.toString()

  // Combine the data with the id and contentHtml
  return {
    id,
    contentHtml,
    ...matterResult.data
  }
}